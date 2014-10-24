"use strict";

var hogan = require('hogan');
var oCommentUtilities = require('o-comment-utilities');
var sizzle = require('sizzle');

var templates = require('../templates.js');

var utils = require('../utils.js');
var formFragments = require('./formFragments.js');

var errorMessageContainerTemplate = hogan.compile(requireText('../../templates/form/errorMessageContainer.ms'));
var buttonContainerTemplate = hogan.compile(requireText('../../templates/form/buttonContainer.ms'));
var buttonTemplate = hogan.compile(requireText('../../templates/form/button.ms'));
var buttonCancelTemplate = hogan.compile(requireText('../../templates/form/buttonCancel.ms'));
var dismissTemplate = hogan.compile(requireText('../../templates/form/dismiss.ms'));
var clearTemplate = templates.clearLine;

/**
 * Form is a helper for creating a form. It handles constructing the form element, generating buttons, forwarding submit and cancel events.
 * @param {Object} config Configuration object which specifies the elements of the form (form fragments, buttons).
 */
function Form (config) {
    if (!config || typeof config !== 'object') {
        throw "Configuration missing or invalid.";
    }

    var myself = this;
    var formObject;

    var events = new oCommentUtilities.Events();

    function init () {
        var item;
        var button;
        var i;

        formObject = document.createElement('form');

        formObject.setAttribute('name', config.name || "");
        formObject.setAttribute('method', config.method || "");
        formObject.setAttribute('action', config.action || "");

        formObject.appendChild(utils.toDOM(errorMessageContainerTemplate.render()));


        if (config.items && config.items.length) {
            for (i = 0; i < config.items.length; i++) {
                item = config.items[i];

                if (typeof item === 'object' && typeof formFragments[item.type] === 'function') {
                    formObject.appendChild(utils.toDOM(formFragments[item.type].call(myself, item)));
                } else if (typeof item === 'string') {
                    formObject.appendChild(utils.toDOM(item));
                }
            }
        }

        if (config.buttons && config.buttons.length) {
            formObject.appendChild(utils.toDOM(buttonContainerTemplate.render()));
            var buttonContainer = sizzle('.comment-buttonContainer', formObject)[0];

            for (i = 0; i < config.buttons.length; i++) {
                button = config.buttons[i];
                
                switch(button.type) {
                    case 'button':
                        if (typeof button.label !== "undefined") {
                            buttonContainer.appendChild(utils.toDOM(buttonTemplate.render({
                                type: 'button',
                                label: button.label
                            })));
                        }
                        break;
                    case 'submitButton':
                        buttonContainer.appendChild(utils.toDOM(buttonTemplate.render({
                            type: 'submit',
                            label: button.label ? button.label : 'Submit'
                        })));
                        break;
                    case 'cancelButton':
                        buttonContainer.appendChild(utils.toDOM(buttonCancelTemplate.render({
                            label: button.label ? button.label : 'cancel'
                        })));
                        break;
                    case 'dismiss':
                        buttonContainer.appendChild(utils.toDOM(dismissTemplate.render({
                            label: button.label
                        })));
                }
            }

            formObject.appendChild(utils.toDOM(clearTemplate.render()));

            var cancelButtons = sizzle('.comment-dialog-cancel-button', formObject);
            var triggerCancel = function () {
                events.trigger('cancel');
            };

            for (var j = 0; j < cancelButtons.length; j++) {
                utils.addEventListener('click', cancelButtons[j], triggerCancel);
            }
        }
    }
    init.call(this);

    /**
     * Listen on events.
     */
    this.on = function () {
        if (arguments[0] === 'submit') {
            utils.addEventListener('submit', formObject, arguments[1]);
        } else {
            events.on.apply(events, arguments);
        }
    };

    /**
     * Remove event listeners.
     */
    this.off = function () {
        if (arguments[0] === 'submit') {
            utils.removeEventListener('submit', formObject, arguments[1]);
        } else {
            events.off.apply(events, arguments);
        }
    };

    /**
     * Return the rendered HTML fragment.
     * @return {DocumentFragment}
     */
    this.render = function () {
        return formObject;
    };


    /**
     * Helper to serialize form values into JavaScript Object (key-value pairs).
     * @param  {DOMObject} form DOM Object of the form element.
     * @return {Object}     Serialized key-value pairs of the form.
     */
    var serializeForm = function (form) {
        var field,
            assocArray = {},
            i,
            j;

        if (typeof form === 'object' && form.nodeName === "FORM"){
            for (i = form.elements.length-1; i >= 0; i--){
                field = form.elements[i];
                if (field.name && field.type !== 'file' && field.type !== 'reset' && !field.hasAttribute('disabled')) {
                    if (field.type === 'select-multiple'){
                        for (j = form.elements[i].options.length-1; j >= 0; j--) {
                            if (field.options[j].selected) {
                                assocArray[field.name] = field.options[j].value;
                            }
                        }
                    } else {
                        if ((field.type !== 'submit' && field.type !== 'button')) {
                            if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                                assocArray[field.name] = field.value;
                            }
                        }
                    }
                }
            }
        }

        return assocArray;
    };

    /**
     * Serializes the form that is built by this instance.
     * @return {Object} Serialized key-value pairs of the form.
     */
    this.serialize = function () {
        return serializeForm(formObject);
    };

    /**
     * Shows an error message on top of the form.
     * @param  {String} errMessages The error message to show.
     */
    this.showError = function (errMessages) {
        var errMessageContainer = sizzle('.comment-error-message', formObject);

        if (errMessageContainer.length) {
            errMessageContainer[0].innerHTML = errMessages;
        }
    };

    /**
     * Clears all the errors.
     */
    this.clearError = function () {
        var errMessageContainer = sizzle('.comment-error-message', formObject);

        if (errMessageContainer.length) {
            errMessageContainer[0].innerHTML = "";
        }
    };
}

/**
 * Export the Form class.
 * @type {Form}
 */
module.exports = Form;

var hogan = require('hogan');
var Events = require('js-events');
var sizzle = require('sizzle');

var templates = require('../templates.js');

var uiUtils = require('../uiUtils.js');
var formFragments = require('./formFragments.js');

var errorMessageContainerTemplate = hogan.compile(requireText('../../templates/form/errorMessageContainer.ms'));
var buttonContainerTemplate = hogan.compile(requireText('../../templates/form/buttonContainer.ms'));
var buttonTemplate = hogan.compile(requireText('../../templates/form/button.ms'));
var buttonCancelTemplate = hogan.compile(requireText('../../templates/form/buttonCancel.ms'));
var dismissTemplate = hogan.compile(requireText('../../templates/form/dismiss.ms'));
var clearTemplate = templates.clearLine;

function Form (config) {
    "use strict";


    if (!config || typeof config !== 'object') {
        throw "Configuration missing or invalid.";
    }

    var myself = this;
    var formObject;

    var events = new Events();

    function init () {
        var item;
        var button;
        var i;

        formObject = document.createElement('form');

        formObject.setAttribute('name', config.name || "");
        formObject.setAttribute('method', config.method || "");
        formObject.setAttribute('action', config.action || "");

        formObject.appendChild(uiUtils.toDOM(errorMessageContainerTemplate.render()));


        if (config.items && config.items.length) {
            for (i = 0; i < config.items.length; i++) {
                item = config.items[i];

                if (typeof item === 'object' && typeof formFragments[item.type] === 'function') {
                    formObject.appendChild(uiUtils.toDOM(formFragments[item.type].call(myself, item)));
                } else if (typeof item === 'string') {
                    formObject.appendChild(uiUtils.toDOM(item));
                }
            }
        }

        if (config.buttons && config.buttons.length) {
            formObject.appendChild(uiUtils.toDOM(buttonContainerTemplate.render()));
            var buttonContainer = sizzle('.buttonContainer', formObject)[0];

            for (i = 0; i < config.buttons.length; i++) {
                button = config.buttons[i];
                
                switch(button.type) {
                    case 'button':
                        if (typeof button.label !== "undefined") {
                            buttonContainer.appendChild(uiUtils.toDOM(buttonTemplate.render({
                                type: 'button',
                                label: button.label
                            })));
                        }
                        break;
                    case 'submitButton':
                        buttonContainer.appendChild(uiUtils.toDOM(buttonTemplate.render({
                            type: 'submit',
                            label: button.label ? button.label : 'Submit'
                        })));
                        break;
                    case 'cancelButton':
                        buttonContainer.appendChild(uiUtils.toDOM(buttonCancelTemplate.render({
                            label: button.label ? button.label : 'cancel'
                        })));
                        break;
                    case 'dismiss':
                        buttonContainer.appendChild(uiUtils.toDOM(dismissTemplate.render({
                            label: button.label
                        })));
                }
            }

            formObject.appendChild(uiUtils.toDOM(clearTemplate.render()));

            var cancelButtons = sizzle('.comments-dialog-cancel-button', formObject);
            var triggerCancel = function () {
                events.trigger('cancel');
            };

            for (var j = 0; j < cancelButtons.length; j++) {
                uiUtils.addEventListener('click', cancelButtons[j], triggerCancel);
            }
        }
    }
    init.call(this);

    
    this.on = function () {
        if (arguments[0] === 'submit') {
            uiUtils.addEventListener('submit', formObject, arguments[1]);
        } else {
            events.on.apply(events, arguments);
        }
    };
    this.off = function () {
        if (arguments[0] === 'submit') {
            uiUtils.removeEventListener('submit', formObject, arguments[1]);
        } else {
            events.off.apply(events, arguments);
        }
    };

    this.render = function () {
        return formObject;
    };



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

    this.serialize = function () {
        return serializeForm(formObject);
    };

    this.showError = function (errMessages) {
        var errMessageContainer = sizzle('.errorMessage', formObject);

        if (errMessageContainer.length) {
            errMessageContainer[0].innerHTML = errMessages;
        }
    };

    this.clearError = function () {
        var errMessageContainer = sizzle('.errorMessage', formObject);

        if (errMessageContainer.length) {
            errMessageContainer[0].innerHTML = "";
        }
    };
}
module.exports = Form;
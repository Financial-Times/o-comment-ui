"use strict";

var hogan = require('hogan');
var oCommentUtilities = require('o-comment-utilities');
var sizzle = require('sizzle');

var utils = require('../utils.js');
var Form = require('../form_builder/Form.js');
var modal = require('./modal.js');

var containerTemplate = hogan.compile(requireText('../../templates/dialog/container.ms'));
var titleTemplate = hogan.compile(requireText('../../templates/dialog/title.ms'));

/**
 * Dialog built within the DOM with custom content. Can be opened either with modal background or without it.
 * @param {String|Form} htmlOrForm  Content of the dialog. Plain HTML in string or instance of a Form.js
 * @param {Object}      userOptions User defined options. Possible fields: modal (default is true), title (title of the dialog).
 */
function Dialog (htmlOrForm, userOptions) {
    var myself = this;

    /**
     * Unique identifier of the dialog's DOM object.
     * @type {String}
     */
    var id = "dialog" + (Math.random() + 1).toString(36).substring(7);

    /**
     * HTML wrapper code of the FT comments dialog.
     * @type {String}
     */
    var html = containerTemplate.render({
        id: id
    });

    /**
     * Default options: modal is enabled by default.
     * @type {Object}
     */
    var defaultOptions = {
        modal: true
    };

    /**
     * User specified options.
     * @type {Object}
     */
    var options = {};

    /**
     * The global container of the elements.
     * @type {DOMObject}
     */
    var container;

    /**
     * The container of the actual content of the dialog.
     */
    var contentContainer;

    /**
     * The body DOM object.
     * @type {DOMObject}
     */
    var bodyEl = document.body || document.getElementsByTagName('body')[0];

    /**
     * Event object on which events can be triggered and handlers can be attached.
     * @type {Object}
     */
    var events = new oCommentUtilities.Events();


    /**
     * Initializes the options.
     */
    function init() {
        oCommentUtilities.merge(options, defaultOptions, (userOptions && typeof userOptions === 'object' ? userOptions : {}));
    }
    init.call(this);


    /**
     * Handles a page resize event and recalculates the center position of the dialog.
     */
    var repositionToCenter = function() {
        if (container) {
            var containerWidthCalculated = utils.getComputedStyle(container).getPropertyValue('width');
            var containerHeightCalculated = utils.getComputedStyle(container).getPropertyValue('height');

            var containerWidthValueMatch = containerWidthCalculated.match(/([0-9.]+)px/);
            var containerHeightValueMatch = containerHeightCalculated.match(/([0-9.]+)px/);

            if (containerWidthValueMatch && containerWidthValueMatch[1]) {
                var containerWidthValue = parseFloat(containerWidthValueMatch[1]);

                container.style.left = (utils.windowSize().width - containerWidthValue) / 2 + "px";
            } else if (containerWidthCalculated === 'auto') {
                container.style.left = (utils.windowSize().width - 500) / 2 + "px";
            }

            if (containerHeightValueMatch && containerHeightValueMatch[1]) {
                var containerHeightValue = parseFloat(containerHeightValueMatch[1]);

                container.style.top = (utils.windowSize().height - containerHeightValue) / 2 + "px";
            } else if (containerHeightCalculated === 'auto') {
                container.style.top = 50 + "px";
            }
        }
    };

    /**
     * Handles the ESC button and closes the dialog.
     * @param  {Object} e Event object
     */
    var onKeyUp = function(e) {
        if (e.keyCode === 27) {
            myself.close();
        }
    };

    /**
     * Close action is initiated within another context (this would be not this instance).
     */
    var closeIt = function () {
        myself.close.call(myself);
    };

    /**
     * Handles page resize. When page resize occurs, recalculates the
     * center of the viewport, adjusts the dialog to the center and
     * adjusts the modal background.
     */
    function enableResizeMonitoring() {
        window.addEventListener('resize', repositionToCenter);
    }

    /**
     * Stops listening for window resize.
     * @return {[type]} [description]
     */
    function disableResizeMonitoring() {
        window.removeEventListener('resize', repositionToCenter);
    }


    /**
     * Listen to events.
     */
    this.on = function() {
        events.on.apply(events, arguments);
    };

    /**
     * Remove listeners.
     */
    this.off = function() {
        events.off.apply(events, arguments);
    };

    /**
     * Returns the current dialog container instance.
     * @return {DOMObject}
     */
    this.getContainer = function() {
        return container;
    };

    /**
     * Opens the dialog by adding the dialog container into the DOM and populating the container
     * with the HTML or Form content.
     * It also adds some event handlers for closing on a user action.
     */
    this.open = function() {
        if (!container) {
            bodyEl.appendChild(utils.toDOM(html));
            container = document.getElementById(id);

            contentContainer = sizzle('.comment-dialog-container', container)[0];
            bodyEl.appendChild(container);

            if (typeof(options.title) !== 'undefined') {
                contentContainer.appendChild(utils.toDOM(titleTemplate.render({
                    title: options.title
                })));
            }
        } else {
            return false;
        }

        if (htmlOrForm instanceof Form) {
            // form

            htmlOrForm.getDomElement().addEventListener('oCommentUi.form.cancel', function() {
                myself.close(false);
            });

            contentContainer.appendChild(htmlOrForm.render());
        } else {
            // plain html

            contentContainer.appendChild(utils.toDOM(htmlOrForm));
        }

        if (options.modal === true) {
            modal.open();

            modal.on('click', closeIt);
        }


        var closeButtons = sizzle('.comment-close-button', container);
        for (var i = 0; i < closeButtons.length; i++) {
            closeButtons[i].addEventListener('click', closeIt);
        }

        document.body.addEventListener('keyup', onKeyUp);

        repositionToCenter();
        enableResizeMonitoring();

        contentContainer.focus();
    };

    /**
     * Closes the current dialog instance.
     * @param  {Boolean} fireEvent Flag to fire events or not. By default it's true.
     */
    this.close = function(fireEvent) {
        disableResizeMonitoring();

        if (container) {
            if (fireEvent !== false) {
                events.trigger('close');
            }

            container.parentNode.removeChild(container);

            if (options.modal) {
                modal.close();
            }

            container = undefined;
            contentContainer = undefined;
        }
    };

    /**
     * Shows the dialog visually (opposite to the hide action).
     */
    this.show = function() {
        if (container) {
            container.style.display = 'block';

            if (modal) {
                modal.open();
            }
        }
    };

    /**
     * Hides the dialog visually, but keeps the instance in life.
     */
    this.hide = function() {
        if (container) {
            container.style.display = 'none';

            if (modal) {
                modal.close();
            }
        }
    };

    /**
     * Disable all buttons of a button collection.
     * @param  {Array} buttons Array of buttons (DOM objects).
     */
    var disableAllButtons = function (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute('disabled', 'disabled');
        }
    };

    /**
     * Disables the buttons (useful when an action is already in progress).
     */
    this.disableButtons = function() {
        var buttons = sizzle('button', container);
        var buttonInputs = sizzle('input[type=button]', container);
        var submitInputs = sizzle('input[type=submit]', container);

        disableAllButtons(buttons);
        disableAllButtons(buttonInputs);
        disableAllButtons(submitInputs);
    };


    /**
     * Enable all buttons of a button collection.
     * @param  {Array} buttons Array of buttons (DOM objects).
     */
    var enableAllButtons = function (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].removeAttribute('disabled');
        }
    };

    /**
     * Enables the buttons (useful when the buttons were disabled while an action was in progress
     * and the user is given back the control).
     */
    this.enableButtons = function() {
        var buttons = sizzle('button', container);
        var buttonInputs = sizzle('input[type=button]', container);
        var submitInputs = sizzle('input[type=submit]', container);

        enableAllButtons(buttons);
        enableAllButtons(buttonInputs);
        enableAllButtons(submitInputs);
    };
}
module.exports = Dialog;

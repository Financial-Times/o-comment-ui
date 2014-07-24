var hogan = require('hogan');
var Events = require('js-events');
var merge = require('js-merge');
var sizzle = require('sizzle');

var utils = require('../utils.js');
var Form = require('../form_builder/Form.js');
var modal = require('./modal.js');

var containerTemplate = hogan.compile(requireText('../../templates/dialog/container.ms'));
var titleTemplate = hogan.compile(requireText('../../templates/dialog/title.ms'));

function Dialog (htmlOrForm, userOptions) {
    "use strict";

    var myself = this;

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
     * @type {DOM Object}
     */
    var container;

    /**
     * The container of the actual content of the dialog.
     */
    var contentContainer;

    /**
     * The body DOM object.
     * @type {DOM Object}
     */
    var bodyEl = document.body || document.getElementsByTagName('body')[0];

    /**
     * Event object on which events can be triggered and handlers can be attached.
     * @type {Object}
     */
    var events = new Events();



    function init() {
        merge(options, defaultOptions, (userOptions && typeof userOptions === 'object' ? userOptions : {}));
    }
    init.call(this);



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

    var onKeyUp = function(e) {
        if (e.keyCode === 27) {
            myself.close();
        }
    };

    var onCloseNeeded = function () {
        myself.close.call(myself);
    };

    /**
     * Handles page resize. When page resize occurs, recalculates the
     * center of the viewport, adjusts the dialog to the center and
     * adjusts the modal background.
     */
    function enableResizeMonitoring() {
        utils.addEventListener('resize', window, repositionToCenter);
    }

    /**
     * Stops listening for window resize.
     * @return {[type]} [description]
     */
    function disableResizeMonitoring() {
        utils.removeEventListener('resize', window, repositionToCenter);
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
     * @return {DOM Object}
     */
    this.getContainer = function() {
        return container;
    };

    /**
     * Opens the dialog by adding the dialog container into the DOM and populating the container
     * with the HTML or Form content.
     * It also adds some event handlers for closing on a user action.
     * @return {[type]} [description]
     */
    this.open = function() {
        if (!container) {
            bodyEl.appendChild(utils.toDOM(html));
            container = document.getElementById(id);

            contentContainer = sizzle('.comments-dialog-container', container)[0];
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

            htmlOrForm.on('cancel', function() {
                myself.close(false);
            });

            contentContainer.appendChild(htmlOrForm.render());
        } else {
            // plain html

            contentContainer.appendChild(utils.toDOM(htmlOrForm));
        }

        if (options.modal === true) {
            modal.open();

            modal.on('click', onCloseNeeded);
        }


        var closeButtons = sizzle('.closeButton', container);
        for (var i = 0; i < closeButtons.length; i++) {
            utils.addEventListener('click', closeButtons[i], onCloseNeeded);
        }

        utils.addEventListener('keyup', document, onKeyUp);

        repositionToCenter();
        enableResizeMonitoring();
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



    var enableAllButtons = function (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].removeAttribute('disabled');
        }
    };

    /**
     * Opposite to the "disableButtons" action, this enables the buttons again.
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
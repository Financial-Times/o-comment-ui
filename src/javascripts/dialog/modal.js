"use strict";

var hogan = require('hogan');
var oCommentUtilities = require('o-comment-utilities');
var sizzle = require('sizzle');
var utils = require('../utils.js');

var modalBgTemplate = hogan.compile(requireText('../../templates/dialog/modalBg.ms'));

/**
 * HTML of the modal background.
 * @type {String}
 */
var html = modalBgTemplate.render();


/**
 * The body DOM object.
 * @type {DOMObject}
 */
var bodyEl;

/**
 * Returns the body DOM element.
 * @return {DOMObject}
 */
var getBodyEl = function () {
    if (!bodyEl) {
        bodyEl = document.body || document.getElementsByTagName('body')[0];
    }

    return bodyEl;
};

/**
 * Event object on which events can be triggered and handlers can be attached.
 * @type {Object}
 */
var events = new oCommentUtilities.Events();

/**
 * Current HTML element created.
 */
var currentElement;


/**
 * Recalculates the size of modal background in case of a browser resize.
 */
var reposition = function () {
    if (currentElement) {
        currentElement.style.width = utils.windowSize().width + "px";
        currentElement.style.height = utils.windowSize().height + "px";
    }
};

/**
 * Handles page resize. When page resize occurs,
 * recalculates viewport, and adjusts the modal background.
 */
function enableResizeMonitoring () {
    utils.addEventListener('resize', window, reposition);
}

/**
 * Disables page resize monitoring.
 */
function disableResizeMonitoring () {
    utils.removeEventListener('resize', window, reposition);
}



/**
 * Public methods.
 */

exports.open = function () {
    if (currentElement) {
        return;
    }

    getBodyEl().appendChild(utils.toDOM(html));
    currentElement = sizzle('.comment-dialog-modalbg', getBodyEl())[0];

    utils.addEventListener('click', currentElement, function () {
        events.trigger('click');
    });

    reposition();
    enableResizeMonitoring();
};

/**
 * Removes the modal bg from the DOM.
 */
exports.close = function () {
    if (!currentElement) {
        return;
    }

    currentElement.parentNode.removeChild(currentElement);
    currentElement = null;

    disableResizeMonitoring();
};

/**
 * Handles events of this module.
 */
exports.on = function () {
    events.on.apply(events, arguments);
};

/**
 * Removes event handlers.
 */
exports.off = function () {
    events.off.apply(events, arguments);
};

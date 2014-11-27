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
    window.addEventListener('resize', reposition);
}

/**
 * Disables page resize monitoring.
 */
function disableResizeMonitoring () {
    window.removeEventListener('resize', reposition);
}



/**
 * Public methods.
 */

exports.open = function () {
    if (currentElement) {
        return;
    }

    document.body.appendChild(utils.toDOM(html));
    currentElement = sizzle('.comment-dialog-modalbg', document.body)[0];

    currentElement.addEventListener('click', function () {
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

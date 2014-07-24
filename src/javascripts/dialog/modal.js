var hogan = require('hogan');
var Events = require('js-events');
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
 * @type {DOM Object}
 */
var bodyEl = document.body || document.getElementsByTagName('body')[0];

/**
 * Event object on which events can be triggered and handlers can be attached.
 * @type {Object}
 */
var events = new Events();

/**
 * Current HTML element created.
 */
var currentElement;


var reposition = function () {
    "use strict";

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
    "use strict";

    utils.addEventListener('resize', window, reposition);
}

/**
 * Disables page resize monitoring.
 */
function disableResizeMonitoring () {
    "use strict";

    utils.removeEventListener('resize', window, reposition);
}



/**
 * Public methods.
 */

exports.open = function () {
    "use strict";

    if (currentElement) {
        return;
    }

    bodyEl.appendChild(utils.toDOM(html));
    currentElement = sizzle('.comments-dialog-modalBg', bodyEl)[0];

    utils.addEventListener('click', currentElement, function () {
        events.trigger('click');
    });

    reposition();
    enableResizeMonitoring();
};

exports.close = function () {
    "use strict";

    if (!currentElement) {
        return;
    }

    currentElement.parentNode.removeChild(currentElement);
    currentElement = null;

    disableResizeMonitoring();
};

exports.on = function () {
    "use strict";

    events.on.apply(events, arguments);
};
exports.off = function () {
    "use strict";

    events.off.apply(events, arguments);
};
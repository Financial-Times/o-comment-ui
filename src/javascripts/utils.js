/**
 * Converts a plain HTML string into a DOM object.
 * @param  {String} htmlString Plain HTML in a string format.
 * @return {DOM object}
 */
exports.toDOM = function (htmlString) {
    "use strict";

    var d = document,
        i,
        a = d.createElement("div"),
        b = d.createDocumentFragment();

    a.innerHTML = htmlString;

    while (a.firstChild) {
        i = a.firstChild;
        b.appendChild(i);
    }

    return b;
};

/**
 * Adds an event listener to a DOM object. Bubbling disabled.
 * @param {String}     event   Type of the event (e.g. click)
 * @param {DOMObject} elem    DOM object to which the handler will be attached.
 * @param {Function}   handler Event handler function.
 */
exports.addEventListener = function (event, elem, handler) {
    "use strict";

    if (elem.addEventListener) {
        // W3C DOM
        elem.addEventListener(event, handler, false);
    } else if (elem.attachEvent) {
        // IE DOM
        elem.attachEvent("on" + event, handler);
    } else {
        elem[event] = handler;
    }
};

/**
 * Removes an event listener from a DOM object. Bubbling disabled.
 * @param {String}     event   Type of the event (e.g. click)
 * @param {DOMObject} elem    DOM object from which the handler will be removed.
 * @param {Function}   handler Event handler function that should be removed.
 */
exports.removeEventListener = function (event, elem, handler) {
    "use strict";

    if (elem.removeEventListener) {
        elem.removeEventListener(event, handler, false);
    } else if (elem.detachEvent) {
        elem.detachEvent('on' + event, handler);
    }
};

/**
 * getComputedStyle polyfill for IE. If native function is available, that one is used.
 * @param  {DOMObject} el     DOM element of which style will be computed.
 * @return {Object}            Object that has a getPropertyValue function which gets a property name as parameter.
 */
exports.getComputedStyle = function (el) {
    "use strict";

    if (!window.getComputedStyle) {
        return {
            getPropertyValue: function (prop) {
                var re = /(\-([a-zA-Z]){1})/g;
                if (prop === 'float') {
                    prop = 'styleFloat';
                }

                if (re.test(prop)) {
                    prop = prop.replace(re, function () {
                        return arguments[2].toUpperCase();
                    });
                }
                return el.currentStyle[prop] ? el.currentStyle[prop] : null;
            }
        };
    } else {
        return window.getComputedStyle(el);
    }
};

/**
 * Computes the window's size.
 * @return {Object} {width: XX, height: YY}
 */
exports.windowSize = function () {
    "use strict";

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return {
        width: x,
        height: y
    };
};
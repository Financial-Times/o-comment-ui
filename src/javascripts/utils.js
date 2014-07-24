exports.toDOM = function (domString) {
    "use strict";

    var d = document,
        i,
        a = d.createElement("div"),
        b = d.createDocumentFragment();

    a.innerHTML = domString;

    while (a.firstChild) {
        i = a.firstChild;
        b.appendChild(i);
    }

    return b;
};

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

exports.removeEventListener = function (event, elem, handler) {
    "use strict";

    if (elem.removeEventListener) {
        elem.removeEventListener(event, handler, false);
    } else if (elem.detachEvent) {
        elem.detachEvent('on' + event, handler);
    }
};

exports.getComputedStyle = function (el, pseudo) {
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
        return window.getComputedStyle(el, pseudo);
    }
};


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
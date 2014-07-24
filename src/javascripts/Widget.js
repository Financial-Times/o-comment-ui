var Events = require('js-events'),
    callbackSync = require('js-callback-sync'),
    WidgetUi = require('./WidgetUi.js');

function Widget (config) {
    "use strict";

    var widgetEl, event, self;

    self = this;

    /**
     * Validation of the initial configuration object.
     */
    if (!config) {
        throw "Config not specified.";
    }

    if (!config.elId) {
        throw "Container element is not specified.";
    }

    if (!config.articleId) {
        throw "Article ID is not specified.";
    }

    if (!config.url) {
        throw "URL is not speficied.";
    }

    if (!config.title) {
        throw "Title is not specified.";
    }

    if (!config.user) {
        throw "User data not specified.";
    }

    widgetEl = document.getElementById(config.elId);
    event = new Events();
    

    config.stream_type = config.stream_type || "livecomments";


    if (!widgetEl) {
        throw "Container does not exist.";
    }

    widgetEl.className += ' livefyre-comments comments-overrides comment-type-' + config.stream_type;


    this.config = config;


    this.ui = new WidgetUi(widgetEl);

    /**
     * Returns the widget container DOM element
     * @return {native DOM object}
     */
    this.getWidgetEl = function () {
        return widgetEl;
    };

    /**
     * Attach new event handlers.
     * @type {function}
     * @param {string} eventName Name of the event to which to attach the handler.
     * @param {function} handler Handler Function which will be called when the event is triggered.
     */
    this.on = event.on;

    /**
     * Removes the event handler(s).
     * @type {function}
     * @param {string} eventName Optional. Specifies the event from which all handlers should be removed.
     *  If omitted, all event handlers are removed from all events.
     * @param {function} handler Optional. The event name should be specified as well if this is specified.
     *  Specifies the handler which should be removed from the event specified.
     */
    this.off = event.off;

    /**
     * Triggers an event.
     * @type {function}
     * @param {string} eventName Name of the event which will be triggered.
     * @param {object} data Optional. Data to be passed to the handler.
     */
    this.trigger = event.trigger;

    /**
     * ! 'this' could not have the value of the instance.
     * To be sure you use the correct instance value, you should
     * save it in the constructor in a variable (var self = this)
     * and use that variable.
     */
    this.loadResources = undefined;

    /**
     * ! 'this' could not have the value of the instance.
     * To be sure you use the correct instance value, you should
     * save it in the constructor in a variable (var self = this)
     * and use that variable.
     */
    this.init = undefined;


    this.onTimeout = function () {
        self.ui.clearContainer();
        self.ui.addNotAvailableMessage();
    };

    this.onError = function () {
        self.ui.clearContainer();
        self.ui.addNotAvailableMessage();
    };
}

Widget.prototype.loadCalled = false;

Widget.prototype.load = function () {
    "use strict";

    var self = this;

    if (!this.loadCalled) {
        this.loadCalled = true;

        var timeout = setTimeout(function () {
            self.trigger('timeout.widget');

            self.onTimeout();
        }, this.config.timeout || 15000);

        
        callbackSync({
            loadResources: this.loadResources,
            init: this.init
        }, function (err, data) {
            if (err) {
                if (err.key === 'loadResources') {
                    self.trigger('error.resources', err.error);
                }

                if (err.key === 'init') {
                    self.trigger('error.init', err.error);
                }

                self.trigger('error.widget', err.error);
                self.onError(err);
                
                clearTimeout(timeout);
                return;
            }

            if (data.init) {
                self.trigger('loaded.init', data.init);

                self.render(data.init, function (err) {
                    if (err) {
                        self.trigger('error.widget', err);
                        self.onError(err);

                        clearTimeout(timeout);

                        return;
                    }

                    clearTimeout(timeout);
                });
            }
        });
    }
};

Widget.__extend = function(child) {
    "use strict";

    if (typeof Object.create === 'function') {
        child.prototype = Object.create( Widget.prototype );
        child.prototype = Object.create(Widget.prototype);
    } else {
        var Tmp = function () {};
        Tmp.prototype = Widget.prototype;
        child.prototype = new Tmp();
        child.prototype.constructor = child;
    }
};

module.exports = Widget;
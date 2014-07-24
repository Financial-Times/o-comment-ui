var i18n = require('./i18n.js'),
    templates = require('./templates.js');

function WidgetUi (widgetContainer) {
    "use strict";

    function scrollTo (withinElement, to, duration, callback) {
        if (duration < 0) {
            callback();
            return;
        }

        var difference = to - withinElement.scrollTop;
        var perTick = difference / duration * 10;

        setTimeout(function() {
            withinElement.scrollTop = withinElement.scrollTop + perTick;

            if (withinElement.scrollTop === to) {
                callback();
                return;
            }

            scrollTo(withinElement, to, duration - 10, callback);
        }, 10);
    }

    function scrollToElement (withinElement, toElement, duration, callback) {
        scrollTo(withinElement, toElement.offsetTop, duration, callback);
    }

    /**
     * Scrolls the page to the widget.
     * @param  {Function} callback Called when the scroll animation is finished.
     */
    this.scrollToWidget = function (callback) {
        var callbackCalled = false;
        var done = function () {
            if (!callbackCalled) {
                callbackCalled = true;

                if (typeof callback === 'function') {
                    callback();
                }
            }
        };

        scrollToElement(document.getElementsByTagName('body')[0], widgetContainer, 500, done);
        scrollToElement(document.getElementsByTagName('head')[0], widgetContainer, 500, done);
    };

    /**
     * Inserts message when comments is not available, either because of SUDS or Livefyre.
     */
    this.addNotAvailableMessage = function () {
        widgetContainer.innerHTML = templates.unavailableTemplate.render({
            message: i18n.texts.unavailable
        });
    };

    /**
     * Clears the container's content.
     */
    this.clearContainer = function () {
        widgetContainer.innerHTML = "";
    };

    this.addTermsAndGuidelineMessage = undefined;
    this.makeReadOnly = undefined;
    this.hideSignInLink = undefined;
    this.addAuthNotAvailableMessage = undefined;
    this.addSettingsLink = undefined;
}
WidgetUi.__extend = function(child) {
    "use strict";

    if (typeof Object.create === 'function') {
        child.prototype = Object.create(WidgetUi.prototype);
        child.prototype = Object.create(WidgetUi.prototype);
    } else {
        var Tmp = function () {};
        Tmp.prototype = WidgetUi.prototype;
        child.prototype = new Tmp();
        child.prototype.constructor = child;
    }
};

module.exports = WidgetUi;
"use strict";

var i18n = require('./i18n.js'),
    templates = require('./templates.js');

/**
 * This class is responsible to handle the UI part of a commenting widget. An instance of this is created within an instance of the `Widget`.
 * While this implementation has predefined methods, it can be extended with particular UI methods.
 * @param {DOMObject} widgetContainer DOM Object of the container of the widget.
 */
function WidgetUi (widgetContainer) {
    /**
     * Helper function to scrolls to a position on the page or within an HTML element.
     * @param  {DOMObject}   withinElement Within which element to scroll (e.g. the whole page or only within a div)
     * @param  {Integer}     to            Target scroll position on the page
     * @param  {Integer}     duration      Duration in milliseconds to animate.
     * @param  {Function}    callback      Callback which is called when finished with the scrolling.
     */
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

    /**
     * Helper function which scrolls to an element of the whole page or within an element
     * @param  {DOMObject}   withinElement Within which element to scroll (e.g. the whole page or only within a div)
     * @param  {DOMObject}   toElement     DOM Object to which to scroll.
     * @param  {Integer}     duration      Duration in milliseconds to animate.
     * @param  {Function}    callback      Callback which is called when finished with the scrolling.\
     */
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
     * Inserts message when comments is not available, either because of the web services or Livefyre.
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

/**
 * Export of WidgetUI.
 * @type {Function}
 */
module.exports = WidgetUi;

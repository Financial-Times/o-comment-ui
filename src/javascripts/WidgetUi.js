const i18n = require('./i18n.js');
const templates = require('./templates.js');
const utils = require('./utils');

/**
 * This class is responsible to handle the UI part of a commenting widget. An instance of this is created within an instance of the `Widget`.
 * While this implementation has predefined methods, it can be extended with particular UI methods.
 * @param {DOMObject} widgetContainer DOM Object or selector of the container of the widget.
 * @return {undefined}
 */
function WidgetUi (widgetContainer) {
	const self = this;

	this.widgetContainer = undefined;

	try {
		if (typeof widgetContainer === "string") {
			const widgetElSelect = document.querySelectorAll(widgetContainer);
			if (widgetElSelect.length) {
				this.widgetContainer = widgetContainer[0];
			} else {
				throw new Error("Selector not valid or does not exists.");
			}
		} else if ((window.HTMLElement && widgetContainer instanceof window.HTMLElement) || (window.Element && widgetContainer instanceof window.Element)) {
			this.widgetContainer = widgetContainer;
		}
	} catch (e) {
		this.widgetContainer = document.body;
	}

	/**
	 * Scrolls the page to the widget.
	 * @param  {Function} callback Called when the scroll animation is finished.
	 * @return {undefined}
	 */
	this.scrollToWidget = function (callback) {
		let callbackCalled = false;
		const done = function () {
			if (!callbackCalled) {
				callbackCalled = true;

				if (typeof callback === 'function') {
					callback();
				}
			}
		};

		window.scrollTo(0, self.widgetContainer.offsetTop);
		done();
	};

	/**
	 * Inserts message when comments is not available, either because of the web services or Livefyre.
	 * @return {undefined}
	 */
	this.addNotAvailableMessage = function () {
		self.widgetContainer.innerHTML = templates.unavailableTemplate.render({
			message: i18n.texts.unavailable
		});
	};

	this.hideTermsAndGuidelinesMessage = function () {
		const termsElement = self.widgetContainer.querySelector('.o-comment-ui--terms-message');

		if (termsElement) {
			termsElement.style.display = 'none';
		}
	};

	this.showTermsAndGuidelinesMessage = function () {
		const termsElement = self.widgetContainer.querySelector('.o-comment-ui--terms-message');

		if (termsElement) {
			termsElement.style.display = 'block';
		}
	};

	/**
	 * Clears the container's content.
	 * @return {undefined}
	 */
	this.clearContainer = function () {
		self.widgetContainer.innerHTML = "";
	};

	this.showEnvironment = function (envName) {
		self.widgetContainer.insertBefore(utils.toDOM(templates.environmentDisplay.render({
			envName: envName
		})), self.widgetContainer.firstChild);
	};

	this.addTermsAndGuidelineMessage = undefined;
	this.makeReadOnly = undefined;
	this.hideSignInLink = undefined;
	this.addAuthNotAvailableMessage = undefined;
	this.addSettingsLink = undefined;

	this.destroy = function () {
		if (self.widgetContainer) {
			self.widgetContainer.parentNode.removeChild(self.widgetContainer);
			self.widgetContainer = null;
		}
	};
}
WidgetUi.__extend = function(child) {
	if (typeof Object.create === 'function') {
		child.prototype = Object.create(WidgetUi.prototype);
		child.prototype = Object.create(WidgetUi.prototype);
	} else {
		const Tmp = function () {};
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

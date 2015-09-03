const oCommentUtilities = require('o-comment-utilities');
const WidgetUi = require('./WidgetUi.js');

/**
 * Widget is responsible to coordinate getting initialization data, loading resources and initializing the Ui.
 * While this class implements some of the basic functionality (handling errors, loading timeout),
 * it should be extended by providing an implementation for getting the initialization data and loading the resources.
 *
 * #### Configuration
 * ###### Mandatory fields:
 *
 * - articleId: ID of the article, any string
 * - url: canonical URL of the page
 * - title: Title of the page
 *
 * ###### Optional fields:
 *
 *  - timeout: Period of time after a timeout is triggered. Default is 15000 ms (15 sec). Its value should be given in milliseconds (ms).
 *
 * @param {String|Object} rootEl Selector or DOM element where the widget should be loaded.
 * @param {Object} config Configuration object, as described in the class description.
 * @return {undefined}
 */
function Widget (rootEl, config) {
	let widgetEl;
	let self;

	self = this;

	try {
		if (!rootEl) {
			rootEl = document.body;
		} else if (!(rootEl instanceof HTMLElement)) { // could throw exception in IE
			rootEl = document.querySelector(rootEl);
		}
	} catch (e) {
		let el;
		if (typeof rootEl === 'string') {
			el = document.querySelector(rootEl);
		}

		if (el) {
			rootEl = el;
		} else {
			rootEl = document.body;
		}
	}

	rootEl.setAttribute('data-'+ self.classNamespace +'-js', '');

	widgetEl = rootEl;

	if (!widgetEl.id) {
		widgetEl.id = self.eventNamespace + '-' + oCommentUtilities.generateId();
	}
	config.elId = widgetEl.id;


	/**
	 * Validation of the initial configuration object.
	 */
	if (!config) {
		return;
	}

	if (!config.articleId) {
		if (!config.articleid) {
			return;
		} else {
			config.articleId = config.articleid;
		}
	}

	if (!config.url) {
		return;
	}

	if (!config.title) {
		return;
	}



	config.timeout = config.timeout || 15;


	this.config = config;


	this.ui = new WidgetUi(widgetEl);

	/**
	 * Returns the widget container DOM element
	 * @return {DOMObject} Widget's DOM element
	 */
	this.getWidgetEl = function () {
		return widgetEl;
	};

	/**
	 * Attach new event handlers.
	 * @type {function}
	 * @param {string} eventName Required. Name of the event to which to attach the handler.
	 * @param {function} eventHandler Required. Handler Function which will be called when the event is triggered.
	 * @return {undefined}
	 */
	this.on = function (eventName, eventHandler) {
		widgetEl.addEventListener(self.eventNamespace + '.' + eventName, eventHandler);
	};

	/**
	 * Removes the event handler(s).
	 * @type {function}
	 * @param {string} eventName Required. Specifies the event from which all handlers should be removed.
	 *  If omitted, all event handlers are removed from all events.
	 * @param {function} eventHandler Required. The event name should be specified as well if this is specified.
	 *  Specifies the handler which should be removed from the event specified.
	 * @return {undefined}
	 */
	this.off = function (eventName, eventHandler) {
		widgetEl.removeEventListener(self.eventNamespace + '.' + eventName, eventHandler);
	};

	/**
	 * Triggers an event.
	 * @type {function}
	 * @param {string} eventName Required. Name of the event which will be triggered.
	 * @param {object} data Optional. Data to be passed to the handler.
	 * @return {undefined}
	 */
	this.trigger = function (eventName, data) {
		const payload = {
			data: data,
			instance: self,
			id: config.elId
		};

		widgetEl.dispatchEvent(new CustomEvent(self.eventNamespace + '.' + eventName, {
			detail: payload,
			bubbles: true
		}));
	};

	/**
	 * ! 'this' could not have the value of the instance.
	 * To be sure you use the correct instance value, you should
	 * save it in the constructor in a variable (var self = this)
	 * and use that variable.
	 * @param {Function} callback function (err, data), where data is the init data
	 * @return {undefined}
	 */
	this.loadInitData = function (callback) {
		callback(new Error("Not implemented"));
	};


	this.onTimeout = function () {
		self.ui.clearContainer();
		self.ui.addNotAvailableMessage();
	};

	this.onError = function () {
		self.ui.clearContainer();
		self.ui.addNotAvailableMessage();
	};

	this.destroy = function () {
		self.config = null;

		self.ui.destroy();
		self.ui = null;

		widgetEl = null;

		self = null;
	};
}

Widget.prototype.initCalled = false;

Widget.prototype.init = function () {
	const self = this;

	if (!this.config) {
		return;
	}

	if (!this.initCalled) {
		this.initCalled = true;

		let timeout;
		if (this.config.timeout > 0) {
			timeout = setTimeout(function () {
				self.trigger('widget.timeout');

				self.onTimeout();
			}, this.config.timeout * 1000);
		}

		self.loadInitData(function (err, data) {
			if (err) {
				self.trigger('error.init', err.error);
				self.trigger('error.widget', err.error);

				self.onError(err);

				clearTimeout(timeout);
				return;
			}

			if (data) {
				self.trigger('data.init', data);

				self.render(data, function (err) {
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
Widget.prototype.eventNamespace = 'oCommentUi';
Widget.prototype.classNamespace = 'o-comment-ui';

Widget.__extend = function(child, eventNamespace, classNamespace) {
	if (typeof Object.create === 'function') {
		child.prototype = Object.create(Widget.prototype);
	} else {
		const Tmp = function () {};
		Tmp.prototype = Widget.prototype;
		child.prototype = new Tmp();
		child.prototype.constructor = child;
	}

	if (eventNamespace) {
		child.prototype.eventNamespace = eventNamespace;
	}

	if (classNamespace) {
		child.prototype.classNamespace = classNamespace;
	}
};

/**
 * Export of Widget.
 * @type {Function}
 */
module.exports = Widget;

const templatingEngine = require('../templatingEngine');

const templates = require('../templates.js');

const utils = require('../utils.js');
const formFragments = require('./formFragments.js');

const errorMessageContainerTemplate = templatingEngine.compile(require('../../templates/form/errorMessageContainer.txt'));
const buttonContainerTemplate = templatingEngine.compile(require('../../templates/form/buttonContainer.txt'));
const buttonTemplate = templatingEngine.compile(require('../../templates/form/button.txt'));
const buttonCancelTemplate = templatingEngine.compile(require('../../templates/form/buttonCancel.txt'));
const dismissTemplate = templatingEngine.compile(require('../../templates/form/dismiss.txt'));
const clearTemplate = templates.clearLine;

/**
 * Helper to serialize form values into JavaScript Object (key-value pairs).
 * @param  {DOMObject} form DOM Object of the form element.
 * @return {Object}     Serialized key-value pairs of the form.
 */
const serializeForm = function (form) {
	let field;
	const assocArray = {};
	let i;
	let j;

	if (typeof form === 'object' && form.nodeName === "FORM"){
		for (i = form.elements.length-1; i >= 0; i--){
			field = form.elements[i];
			if (field.name && field.type !== 'file' && field.type !== 'reset' && !field.hasAttribute('disabled')) {
				if (field.type === 'select-multiple'){
					for (j = form.elements[i].options.length-1; j >= 0; j--) {
						if (field.options[j].selected) {
							assocArray[field.name] = field.options[j].value;
						}
					}
				} else {
					if (field.type !== 'submit' && field.type !== 'button') {
						if (field.type !== 'checkbox' && field.type !== 'radio' || field.checked) {
							assocArray[field.name] = field.value;
						}
					}
				}
			}
		}
	}

	return assocArray;
};

/**
 * Form is a helper for creating a form. It handles constructing the form element, generating buttons, forwarding submit and cancel events.
 * @param {Object} config Configuration object which specifies the elements of the form (form fragments, buttons).
 * @return {undefined}
 */
function OverlayFormContent (config) {
	if (!config || typeof config !== 'object') {
		throw new Error("Configuration missing or invalid.");
	}

	let myself = this;
	let formObject;
	let container;

	function init () {
		let item;
		let button;
		let i;


		container = document.createElement('div');
		container.className = "o-comment-ui--overlay-content";

		formObject = document.createElement('form');
		formObject.setAttribute('name', config.name || "");
		formObject.setAttribute('method', config.method || "");
		formObject.setAttribute('action', config.action || "");

		container.appendChild(formObject);

		formObject.appendChild(utils.toDOM(errorMessageContainerTemplate.render()));


		if (config.items && config.items.length) {
			for (i = 0; i < config.items.length; i++) {
				item = config.items[i];

				if (typeof item === 'object' && typeof formFragments[item.type] === 'function') {
					formObject.appendChild(utils.toDOM(formFragments[item.type].call(myself, item)));
				} else if (typeof item === 'string') {
					formObject.appendChild(utils.toDOM(item));
				}
			}
		}

		if (config.buttons && config.buttons.length) {
			formObject.appendChild(utils.toDOM(buttonContainerTemplate.render()));
			const buttonContainer = formObject.querySelector('.o-comment-ui--overlay-button-container');

			for (i = 0; i < config.buttons.length; i++) {
				button = config.buttons[i];

				switch(button.type) {
					case 'button':
						if (typeof button.label !== "undefined" && button.label) {
							buttonContainer.appendChild(utils.toDOM(buttonTemplate.render({
								type: 'button',
								label: button.label
							})));
						}
						break;
					case 'submitButton':
						buttonContainer.appendChild(utils.toDOM(buttonTemplate.render({
							type: 'submit',
							label: button.label ? button.label : 'Submit'
						})));
						break;
					case 'cancelButton':
						buttonContainer.appendChild(utils.toDOM(buttonCancelTemplate.render({
							label: button.label ? button.label : 'cancel'
						})));
						break;
					case 'dismiss':
						if (typeof button.label !== "undefined" && button.label) {
							buttonContainer.appendChild(utils.toDOM(dismissTemplate.render({
								label: button.label
							})));
						}
						break;
					default:
						throw new Error('A button of type: ' + button.type + ' has been passed but is not expected.');
				}
			}

			formObject.appendChild(utils.toDOM(clearTemplate.render()));

			const cancelButtons = formObject.querySelectorAll('.o-comment-ui--cancel-button');
			const triggerCancel = function () {
				container.dispatchEvent(new CustomEvent('oCommentUi.form.cancel', {
					bubbles: true
				}));
			};

			for (let j = 0; j < cancelButtons.length; j++) {
				cancelButtons[j].addEventListener('click', triggerCancel);
			}
		}
	}
	init.call(this);


	this.getContainerDomElement = function () {
		return container;
	};
	this.getDomElement = this.getContainerDomElement;

	this.getFormDomElement = function () {
		return formObject;
	};

	/**
	 * Serializes the form that is built by this instance.
	 * @return {Object} Serialized key-value pairs of the form.
	 */
	this.serialize = function () {
		return serializeForm(formObject);
	};

	/**
	 * Shows an error message on top of the form.
	 * @param  {String} errMessages The error message to show.
	 * @return {undefined}
	 */
	this.showError = function (errMessages) {
		const errMessageContainer = formObject.querySelector('.o-comment-ui--overlay-error-message');

		if (errMessageContainer) {
			errMessageContainer.innerHTML = errMessages;
		}
	};

	/**
	 * Clears all the errors.
	 * @return {undefined}
	 */
	this.clearError = function () {
		const errMessageContainer = formObject.querySelector('.o-comment-ui--overlay-error-message');

		if (errMessageContainer) {
			errMessageContainer.innerHTML = "";
		}
	};


	/**
	 * Disable all buttons of a button collection.
	 * @param  {Array} buttons Array of buttons (DOM objects).
	 * @return {undefined}
	 */
	const disableAllButtons = function (buttons) {
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].setAttribute('disabled', 'disabled');
		}
	};

	/**
	 * Disables the buttons (useful when an action is already in progress).
	 * @return {undefined}
	 */
	this.disableButtons = function() {
		const buttons = formObject.querySelectorAll('button');
		const buttonInputs = formObject.querySelectorAll('input[type=button]');
		const submitInputs = formObject.querySelectorAll('input[type=submit]');

		disableAllButtons(buttons);
		disableAllButtons(buttonInputs);
		disableAllButtons(submitInputs);
	};


	/**
	 * Enable all buttons of a button collection.
	 * @param  {Array} buttons Array of buttons (DOM objects).
	 * @return {undefined}
	 */
	const enableAllButtons = function (buttons) {
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].removeAttribute('disabled');
		}
	};

	/**
	 * Enables the buttons (useful when the buttons were disabled while an action was in progress
	 * and the user is given back the control).
	 * @return {undefined}
	 */
	this.enableButtons = function() {
		const buttons = formObject.querySelectorAll('button');
		const buttonInputs = formObject.querySelectorAll('input[type=button]');
		const submitInputs = formObject.querySelectorAll('input[type=submit]');

		enableAllButtons(buttons);
		enableAllButtons(buttonInputs);
		enableAllButtons(submitInputs);
	};

	this.destroy = function () {
		formObject = null;
		myself = null;
	};
}

/**
 * Export the Form class.
 * @type {Form}
 */
module.exports = OverlayFormContent;

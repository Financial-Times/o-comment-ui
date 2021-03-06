const Overlay = require('o-overlay').default;
const OverlayFormContent = require('../overlay_content_builder/OverlayFormContent.js');

let shown = false;


/**
 * Settings dialog where the user can change its pseudonym or email preferences.
 * @param  {Object} currentPseudonym Required. Current pseudonym of the user.
 * @param  {Object} callbacks Object with callback functions. Possible fields:
 *                                - submit: Required. Function that is called when the form is submitted
 *                                - close:  Optional. Function that is called when the dialog is closed.
 * @return {undefined}
 */
exports.show = function (currentPseudonym, callbacks) {
	if (shown === false) {
		if (typeof callbacks !== 'object' || !callbacks) {
			throw new Error("Callbacks not provided.");
		}

		if (typeof callbacks.submit !== 'function') {
			throw new Error("Submit callback not provided.");
		}

		if (!currentPseudonym) {
			return;
		}

		shown = true;
		let inProgress = false;

		currentPseudonym = currentPseudonym || "";

		let form = new OverlayFormContent({
			method: 'GET',
			action: "",
			name: 'changepseudonym',
			items: [
				{
					type: 'changePseudonym',
					currentPseudonym: currentPseudonym
				}
			],
			buttons: [
				{
					type: 'submitButton',
					label: 'Save'
				},
				{
					type: 'cancelButton'
				}
			]
		});

		let overlayInstance = new Overlay("oCommentUi_changePseudonymDialog", {
			html: form.getContainerDomElement(),
			heading: {
				title: "Commenting Settings"
			},
			modal: true
		});

		let ignoreCloseEvent = false;

		const onSubmitHandler = function (evt) {
			if (!inProgress) {
				inProgress = true;
				form.disableButtons();

				const formData = form.serialize();

				callbacks.submit(formData, function (err) {
					if (err) {
						form.showError(err);

						form.enableButtons();
						inProgress = false;

						return;
					}

					shown = false;

					ignoreCloseEvent = true;
					overlayInstance.close();
				});
			}

			if (evt.preventDefault) {
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}

			return false;
		};
		form.getFormDomElement().addEventListener('submit', onSubmitHandler);

		const onCloseInternalHandler = function () {
			shown = false;

			if (form) {
				form.getFormDomElement().removeEventListener('submit', onSubmitHandler);
				form.getContainerDomElement().removeEventListener('oCommentUi.form.cancel', onCancelHandler);
				form.destroy();
				form = null;
			}

			if (overlayInstance) {
				overlayInstance.wrapper.removeEventListener('oOverlay.destroy', onCloseInternalHandler);
				overlayInstance = null;
			}

			if (!ignoreCloseEvent) {
				if (typeof callbacks.close === 'function') {
					callbacks.close();
				}
			}
		};

		overlayInstance.open();

		const onCancelHandler = function () {
			overlayInstance.close();
		};
		form.getDomElement().addEventListener('oCommentUi.form.cancel', onCancelHandler);
		overlayInstance.wrapper.addEventListener('oOverlay.destroy', onCloseInternalHandler);
	}
};

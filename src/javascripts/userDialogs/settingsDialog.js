const Overlay = require('o-overlay').default;
const OverlayFormContent = require('../overlay_content_builder/OverlayFormContent.js');

let shown = false;

/**
 * Settings dialog where the user can change its pseudonym or email preferences.
 * @param  {Object} currentData Required. Current settings of the user, which consists of displayName and email settings.
 * @param  {Object} callbacks Object with callback functions. Possible fields:
 *                                - submit: Required. Function that is called when the form is submitted
 *                                - close:  Optional. Function that is called when the dialog is closed.
 * @return {undefined}
 */
exports.show = function (currentData, callbacks) {
	if (shown === false) {
		if (typeof callbacks !== 'object' || !callbacks) {
			throw new Error("Callbacks not provided.");
		}

		if (typeof callbacks.submit !== 'function') {
			throw new Error("Submit callback not provided.");
		}

		shown = true;
		let inProgress = false;


		const currentSettings = (currentData && typeof currentData === 'object' && currentData.settings) ? currentData.settings : {};
		const currentPseudonym = (currentData && typeof currentData === 'object' && currentData.displayName) ? currentData.displayName : "";

		let form = new OverlayFormContent({
			method: 'GET',
			action: "",
			name: 'changepseudonym',
			items: [
				{
					type: 'changePseudonym',
					currentPseudonym: currentPseudonym
				},
				{
					type: 'emailSettings',
					currentSettings: currentSettings
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

		let overlayInstance = new Overlay("oCommentUi_settingsDialog", {
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

				if (formData.emailautofollow !== 'on') {
					formData.emailautofollow = 'off';
				}

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
		form.getContainerDomElement().addEventListener('oCommentUi.form.cancel', onCancelHandler);
		overlayInstance.wrapper.addEventListener('oOverlay.destroy', onCloseInternalHandler);
	}
};

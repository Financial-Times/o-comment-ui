"use strict";

var Overlay = require('o-overlay'),
	OverlayFormContent = require('./overlay_content_builder/OverlayFormContent.js'),
	oCommentUtilities = require('o-comment-utilities');


var showSetPseudonymDialogShown = false;
/**
 * Shows a dialog for setting the initial pseudonym (shown when the user doesn't have a pseudonym set).
 * @param  {Object} callbacks Object with callback functions. Possible fields:
 *                                - submit: Required. Function that is called when the form is submitted
 *                                - close:  Optional. Function that is called when the dialog is closed.
 */
exports.showSetPseudonymDialog = function (callbacks) {
	if (showSetPseudonymDialogShown === false) {
		if (typeof callbacks !== 'object' || !callbacks) {
			throw new Error("Callbacks not provided.");
		}

		if (typeof callbacks.submit !== 'function') {
			throw new Error("Submit callback not provided.");
		}


		showSetPseudonymDialogShown = true;
		var inProgress = false;

		var form = new OverlayFormContent({
			method: 'GET',
			action: "",
			name: 'setpseudonym',
			items: [
				{
					type: 'initialPseudonym'
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

		var idOfTheOverlay = "oCommentUi_showSetPseudonymDialog";
		var overlay = new Overlay(idOfTheOverlay, {
			html: form.getContainerDomElement(),
			heading: {
				title: "Commenting Settings"
			},
			modal: true
		});

		var ignoreCloseEvent = false;

		form.getFormDomElement().addEventListener('submit', function (evt) {
			if (!inProgress) {
				inProgress = true;
				form.disableButtons();

				var formData = form.serialize();

				callbacks.submit(formData, function (err) {
					if (err) {
						form.showError(err);

						form.enableButtons();
						inProgress = false;

						return;
					}

					showSetPseudonymDialogShown = false;

					ignoreCloseEvent = true;
					overlay.close();
				});
			}

			if (evt.preventDefault) {
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}

			return false;
		});


		var onCloseInternalHandler = function () {
			if (!ignoreCloseEvent) {
				showSetPseudonymDialogShown = false;

				if (typeof callbacks.close === 'function') {
					callbacks.close();
				}

				if (!inProgress) {
					oCommentUtilities.logger.log('pseudonym refused');
				}
			}
		};

		overlay.open();

		form.getContainerDomElement().addEventListener('oCommentUi.form.cancel', function () {
			overlay.close();
			onCloseInternalHandler();
		});
		overlay.wrapper.addEventListener('oOverlay.destroy', onCloseInternalHandler);
	}
};


var showSettingsDialogShown = false;
/**
 * Settings dialog where the user can change its pseudonym or email preferences.
 * @param  {Object} currentData Required. Current settings of the user, which consists of displayName and email settings.
 * @param  {Object} callbacks Object with callback functions. Possible fields:
 *                                - submit: Required. Function that is called when the form is submitted
 *                                - close:  Optional. Function that is called when the dialog is closed.
 */
exports.showSettingsDialog = function (currentData, callbacks) {
	if (showSettingsDialogShown === false) {
		if (typeof callbacks !== 'object' || !callbacks) {
			throw new Error("Callbacks not provided.");
		}

		if (typeof callbacks.submit !== 'function') {
			throw new Error("Submit callback not provided.");
		}

		if (!currentData) {
			return;
		}

		showSettingsDialogShown = true;
		var inProgress = false;


		var currentSettings = (currentData && typeof currentData === 'object' && currentData.settings) ? currentData.settings : {};
		var currentPseudonym = (currentData && typeof currentData === 'object' && currentData.displayName) ? currentData.displayName : "";

		var form = new OverlayFormContent({
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

		var idOfTheOverlay = "oCommentUi_showSettingsDialog";
		var overlay = new Overlay(idOfTheOverlay, {
			html: form.getContainerDomElement(),
			heading: {
				title: "Commenting Settings"
			},
			modal: true
		});

		var ignoreCloseEvent = false;

		form.getFormDomElement().addEventListener('submit', function (evt) {
			if (!inProgress) {
				inProgress = true;
				form.disableButtons();

				var formData = form.serialize();

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

					showSettingsDialogShown = false;

					ignoreCloseEvent = true;
					overlay.close();
				});
			}

			if (evt.preventDefault) {
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}

			return false;
		});

		var onCloseInternalHandler = function () {
			if (!ignoreCloseEvent) {
				showSettingsDialogShown = false;

				if (typeof callbacks.close === 'function') {
					callbacks.close();
				}
			}
		};

		overlay.open();

		form.getContainerDomElement().addEventListener('oCommentUi.form.cancel', function () {
			overlay.close();
			onCloseInternalHandler();
		});
		overlay.wrapper.addEventListener('oOverlay.destroy', onCloseInternalHandler);
	}
};




var changePseudonymDialogShown = false;
/**
 * Settings dialog where the user can change its pseudonym or email preferences.
 * @param  {Object} currentPseudonym Required. Current pseudonym of the user.
 * @param  {Object} callbacks Object with callback functions. Possible fields:
 *                                - submit: Required. Function that is called when the form is submitted
 *                                - close:  Optional. Function that is called when the dialog is closed.
 */
exports.showChangePseudonymDialog = function (currentPseudonym, callbacks) {
	if (changePseudonymDialogShown === false) {
		if (typeof callbacks !== 'object' || !callbacks) {
			throw new Error("Callbacks not provided.");
		}

		if (typeof callbacks.submit !== 'function') {
			throw new Error("Submit callback not provided.");
		}

		if (!currentPseudonym) {
			return;
		}

		changePseudonymDialogShown = true;
		var inProgress = false;

		currentPseudonym = currentPseudonym || "";

		var form = new OverlayFormContent({
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

		var idOfTheOverlay = "oCommentUi_showChangePseudonymDialog";
		var overlay = new Overlay(idOfTheOverlay, {
			html: form.getContainerDomElement(),
			heading: {
				title: "Commenting Settings"
			},
			modal: true
		});

		var ignoreCloseEvent = false;

		form.getFormDomElement().addEventListener('submit', function (evt) {
			if (!inProgress) {
				inProgress = true;
				form.disableButtons();

				var formData = form.serialize();

				callbacks.submit(formData, function (err) {
					if (err) {
						form.showError(err);

						form.enableButtons();
						inProgress = false;

						return;
					}

					changePseudonymDialogShown = false;

					ignoreCloseEvent = true;
					overlay.close();
				});
			}

			if (evt.preventDefault) {
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}

			return false;
		});

		var onCloseInternalHandler = function () {
			if (!ignoreCloseEvent) {
				changePseudonymDialogShown = false;

				if (typeof callbacks.close === 'function') {
					callbacks.close();
				}
			}
		};

		overlay.open();

		form.getDomElement().addEventListener('oCommentUi.form.cancel', function () {
			overlay.close();
			onCloseInternalHandler();
		});
		overlay.wrapper.addEventListener('oOverlay.destroy', onCloseInternalHandler);
	}
};


var showEmailAlertDialogShown = false;
/**
 * Shows a dialog which reminds the user to save its email preferences if he/she didn't do so.
 * @param  {Object} callbacks Object with callback functions. Possible fields:
 *                                - submit: Required. Function that is called when the form is submitted
 *                                - close:  Optional. Function that is called when the dialog is closed.
 */
exports.showEmailAlertDialog = function (callbacks) {
	if (showEmailAlertDialogShown === false) {
		if (typeof callbacks !== 'object' || !callbacks) {
			throw new Error("Callbacks not provided.");
		}

		if (typeof callbacks.submit !== 'function') {
			throw new Error("Submit callback not provided.");
		}


		showEmailAlertDialogShown = true;
		var inProgress = false;

		var form = new OverlayFormContent({
			method: 'GET',
			action: "",
			name: 'changepseudonym',
			items: [
				'<strong>Your comment has been submitted.</strong>',
				{
					type: 'followExplanation'
				},
				{
					type: 'emailSettingsStandalone'
				},
				{
					type: 'commentingSettingsExplanation'
				}
			],
			buttons: [
				{
					type: 'dismiss',
					label: 'Don\'t show me this message again:'
				},
				{
					type: 'submitButton',
					label: 'Save'
				}
			]
		});

		var idOfTheOverlay = "oCommentUi_showEmailAlertDialog";
		var overlay = new Overlay(idOfTheOverlay, {
			html: form.getDomElement(),
			heading: {
				title: "Commenting Settings"
			},
			modal: true
		});

		var ignoreCloseEvent = false;

		form.getDomElement().addEventListener('submit', function (evt) {
			if (!inProgress) {
				inProgress = true;

				var formData = form.serialize();

				if (formData.emailautofollow !== 'on') {
					formData.emailautofollow = 'off';
				}

				delete formData.dismiss;

				form.disableButtons();

				callbacks.submit(formData, function (err) {
					if (err) {
						form.showError(err);

						inProgress = false;
						form.enableButtons();

						return;
					}

					ignoreCloseEvent = true;
					overlay.close();
				});
			}

			if (evt.preventDefault) {
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}

			return false;
		});

		var onCloseInternalHandler = function () {
			if (!ignoreCloseEvent) {
				showEmailAlertDialogShown = false;

				if (typeof callbacks.close === 'function') {
					callbacks.close();
				}
			}
		};

		overlay.open();

		form.getDomElement().addEventListener('oCommentUi.form.cancel', function () {
			overlay.close();
			onCloseInternalHandler();
		});
		overlay.wrapper.addEventListener('oOverlay.destroy', onCloseInternalHandler);
	}
};


var showInactivityMessageDialogShown = false;
/**
 * Shows a dialog with a sign in link to re-login after a session expire.
 * @param  {Object} callbacks Object with callback functions. Possible fields:
 *                                - submit: Required. Function that is called when the form is submitted
 *                                - close:  Optional. Function that is called when the dialog is closed.
 */
exports.showInactivityMessage = function (callbacks) {
	if (showInactivityMessageDialogShown === false) {
		if (typeof callbacks !== 'object' || !callbacks) {
			throw new Error("Callbacks not provided.");
		}

		if (typeof callbacks.submit !== 'function') {
			throw new Error("Submit callback not provided.");
		}

		showInactivityMessageDialogShown = true;

		var form = new OverlayFormContent(
			{
				method: 'GET',
				action: '',
				name: 'sessionexpired',
				items: [
					{
						type: 'sessionExpired'
					}
				],
				buttons: [
					{
						type: 'submitButton',
						label: 'Sign in'
					},
					{
						type: 'cancelButton'
					}
				]
			}
		);

		var idOfTheOverlay = "oCommentUi_showInactivityMessage";
		var overlay = new Overlay(idOfTheOverlay, {
			html: form.getDomElement(),
			heading: {
				title: "Session expired"
			},
			modal: true
		});

		form.getDomElement().addEventListener('submit', function (evt) {
			callbacks.submit();

			if (evt.preventDefault) {
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}

			return false;
		});

		var onCloseInternalHandler = function () {
			showInactivityMessageDialogShown = false;

			if (typeof callbacks.close === 'function') {
				callbacks.close();
			}
		};

		overlay.open();

		form.getDomElement().addEventListener('oCommentUi.form.cancel', function () {
			overlay.close();
			onCloseInternalHandler();
		});
		overlay.wrapper.addEventListener('oOverlay.destroy', onCloseInternalHandler);
	}
};

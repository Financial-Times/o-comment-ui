var Dialog = require('./dialog/Dialog.js'),
    Form = require('./form_builder/Form.js'),
    commentUtilities = require('comment-utilities');


var showSetPseudonymDialogShown = false;
/**
 * Shows a dialog for setting the initial pseudonym (shown when the user doesn't have a pseudonym set).
 * @param  {Object} callbacks Object with callback functions. Possible fields:
 *                                - submit: Required. Function that is called when the form is submitted
 *                                - close:  Optional. Function that is called when the dialog is closed.
 */
exports.showSetPseudonymDialog = function (callbacks) {
    "use strict";

    if (showSetPseudonymDialogShown === false) {
        if (typeof callbacks !== 'object' || !callbacks) {
            throw new Error("Callbacks not provided.");
        }

        if (typeof callbacks.submit !== 'function') {
            throw new Error("Submit callback not provided.");
        }


        showSetPseudonymDialogShown = true;
        var inProgress = false;

        var form = new Form({
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
        var dialog = new Dialog(form, {
            title: "Commenting Settings"
        });

        form.on('submit', function (event) {
            if (!inProgress) {
                inProgress = true;
                dialog.disableButtons();

                var formData = form.serialize();

                callbacks.submit(formData, function (err) {
                    if (err) {
                        form.showError(err);

                        dialog.enableButtons();
                        inProgress = false;

                        return;
                    }

                    showSetPseudonymDialogShown = false;

                    dialog.close(false);
                });
            }

            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }

            return false;
        });


        var onCloseInternalHandler = function () {
            showSetPseudonymDialogShown = false;
            
            if (typeof callbacks.close === 'function') {
                callbacks.close();
            }

            if (!inProgress) {
                commentUtilities.logger.log('pseudonym refused');
            }
        };

        form.on('cancel', onCloseInternalHandler);
        dialog.on('close', onCloseInternalHandler);

        dialog.open();
    }
};


var showSettingsDialogShown = false;
/**
 * Settings dialog where the user can change its pseudonym or email preferences.
 * @param  {Object} currentData Required. Function that is called when the form is submitted. 
 * @param  {Object} callbacks Object with callback functions. Possible fields:
 *                                - submit: Required. Function that is called when the form is submitted
 *                                - close:  Optional. Function that is called when the dialog is closed.
 */
exports.showSettingsDialog = function (currentData, callbacks) {
    "use strict";

    if (showSettingsDialogShown === false) {
        if (typeof callbacks !== 'object' || !callbacks) {
            throw new Error("Callbacks not provided.");
        }

        if (typeof callbacks.submit !== 'function') {
            throw new Error("Submit callback not provided.");
        }

        if (!currentData) {
            exports.showInactivityMessage();
            return;
        }

        showSettingsDialogShown = true;
        var inProgress = false;


        var currentSettings = (currentData && typeof currentData === 'object' && currentData.settings) ? currentData.settings : {};
        var currentPseudonym = (currentData && typeof currentData === 'object' && currentData.displayName) ? currentData.displayName : "";

        var form = new Form({
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
        var dialog = new Dialog(form, {
            title: "Commenting Settings"
        });

        form.on('submit', function (event) {
            if (!inProgress) {
                inProgress = true;
                dialog.disableButtons();

                var formData = form.serialize();

                if (formData.emailautofollow !== 'on') {
                    formData.emailautofollow = 'off';
                }

                callbacks.submit(formData, function (err) {
                    if (err) {
                        form.showError(err);

                        dialog.enableButtons();
                        inProgress = false;

                        return;
                    }

                    showSettingsDialogShown = false;

                    dialog.close(false);
                });
            }

            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }

            return false;
        });

        var onCloseInternalHandler = function () {
            showSettingsDialogShown = false;

            if (typeof callbacks.close === 'function') {
                callbacks.close();
            }
        };

        dialog.on('close', onCloseInternalHandler);
        form.on('cancel', onCloseInternalHandler);

        dialog.open();
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
    "use strict";

    if (showEmailAlertDialogShown === false) {
        if (typeof callbacks !== 'object' || !callbacks) {
            throw new Error("Callbacks not provided.");
        }

        if (typeof callbacks.submit !== 'function') {
            throw new Error("Submit callback not provided.");
        }


        showEmailAlertDialogShown = true;
        var inProgress = false;
    
        var form = new Form({
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
        var dialog = new Dialog(form, {
            title: "Commenting Settings"
        });

        form.on('submit', function (event) {
            if (!inProgress) {
                inProgress = true;

                var formData = form.serialize();

                if (formData.emailautofollow !== 'on') {
                    formData.emailautofollow = 'off';
                }

                delete formData.dismiss;

                dialog.disableButtons();

                callbacks.submit(formData, function (err) {
                    if (err) {
                        form.showError(err);

                        inProgress = false;
                        dialog.enableButtons();

                        return;
                    }

                    dialog.close(false);
                });
            }

            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }

            return false;
        });

        var onCloseInternalHandler = function () {
            showEmailAlertDialogShown = false;

            if (typeof callbacks.close === 'function') {
                callbacks.close();
            }
        };

        dialog.on('close', onCloseInternalHandler);
        form.on('cancel', onCloseInternalHandler);

        dialog.open();
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
    "use strict";

    if (showInactivityMessageDialogShown === false) {
        if (typeof callbacks !== 'object' || !callbacks) {
            throw new Error("Callbacks not provided.");
        }

        if (typeof callbacks.submit !== 'function') {
            throw new Error("Submit callback not provided.");
        }

        showInactivityMessageDialogShown = true;

        var form = new Form(
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
        var dialog = new Dialog(form, {
            title: "Session expired"
        });
        
        form.on('submit', function (event) {
            callbacks.submit();
            
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }

            return false;
        });

        var onCloseInternalHandler = function () {
            showInactivityMessageDialogShown = false;

            if (typeof callbacks.close === 'function') {
                callbacks.close();
            }
        };

        dialog.on('close', onCloseInternalHandler);
        form.on('cancel', onCloseInternalHandler);

        dialog.open();
    }
};
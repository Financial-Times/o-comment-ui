var Dialog = require('./dialog/Dialog.js'),
    Form = require('./form_builder/Form.js'),
    logger = require('js-logger');


var showSetPseudonymDialogShown = false;
/**
 * Shows the set pseudonym dialog.
 */
exports.showSetPseudonymDialog = function (onSubmit, onClose) {
    "use strict";

    if (showSetPseudonymDialogShown === false) {
        if (typeof onSubmit !== 'function') {
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

                onSubmit(formData, function (err) {
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
            
            //events.trigger('refusedPseudonym');
            if (typeof onClose === 'function') {
                onClose();
            }

            if (!inProgress) {
                logger.log('pseudonym refused');
            }
        };

        form.on('cancel', onCloseInternalHandler);
        dialog.on('close', onCloseInternalHandler);

        dialog.open();
    }
};


var showSettingsDialogShown = false;
/**
 * Shows the change pseudonym dialog.
 */
exports.showSettingsDialog = function (currentData, onSubmit, onClose) {
    "use strict";

    if (showSettingsDialogShown === false) {
        if (typeof onSubmit !== 'function') {
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

                onSubmit(formData, function (err) {
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

            if (typeof onClose === 'function') {
                onClose();
            }
        };

        dialog.on('close', onCloseInternalHandler);
        form.on('cancel', onCloseInternalHandler);

        dialog.open();
    }
};


var showEmailAlertDialogShown = false;
/**
 * Shows a dialog with email alert settings only.
 */
exports.showEmailAlertDialog = function (onSubmit, onClose) {
    "use strict";

    if (showEmailAlertDialogShown === false) {
        if (typeof onSubmit !== 'function') {
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

                onSubmit(formData, function (err) {
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

            if (typeof onClose === 'function') {
                onClose();
            }
        };

        dialog.on('close', onCloseInternalHandler);
        form.on('cancel', onCloseInternalHandler);

        dialog.open();
    }
};


var showInactivityMessageDialogShown = false;
/**
 * Shows inactivity message when the user's session is expired.
 */
exports.showInactivityMessage = function (onSubmit, onClose) {
    "use strict";

    if (showInactivityMessageDialogShown === false) {
        if (typeof onSubmit !== 'function') {
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
            onSubmit();
            //window.location.href = 'https://registration.ft.com/registration/barrier/login?location='+ encodeURIComponent(document.location.href);

            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }

            return false;
        });

        var onCloseInternalHandler = function () {
            showInactivityMessageDialogShown = false;

            if (typeof onClose === 'function') {
                onClose();
            }
        };

        dialog.on('close', onCloseInternalHandler);
        form.on('cancel', onCloseInternalHandler);

        dialog.open();
    }
};
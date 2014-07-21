var Dialog = require('./dialog/Dialog.js'),
    Form = require('./form_builder/Form.js'),

    Events = require('js-events'),
    logger = require('js-logger');


/**
 * Error messages coming from SUDS could be not user friendly.
 * So some of the messages are mapped to a more user friendly message.
 * @type {Object}
 */
var sudsMessageOverrides = {
    'User session is not valid.': 'You are not currently signed in to FT.com, please '+
            '<a href="https://registration.ft.com/registration/barrier/login?location='+ encodeURIComponent(document.location.href) +'">sign in</a> to create a pseudonym'
};
exports.sudsMessageOverrides = sudsMessageOverrides;


exports.login = function () {};
exports.logout = function () {};

var events = new Events();
exports.on = events.on;
exports.off = events.off;


var showSetPseudonymDialogShown = false;
/**
 * Shows the set pseudonym dialog.
 * @param  {Object} delegate
 */
exports.showSetPseudonymDialog = function (config, callbacks) {
    "use strict";

    if (showSetPseudonymDialogShown === false) {
        if (!callbacks || typeof callbacks !== 'object') {
            throw new Error("Callbacks not provided.");
        }

        if (typeof callbacks.onSubmit) {
            throw new Error("Submit callback not provided.");
        }

        if (!config || typeof config !== 'object') {
            throw new Error("Configuration not provided.");
        }

        if (!config.user || config.user !== 'object') {
            throw new Error("User object not provided.");
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

                callbacks.onSubmit(formData, config.user, function (err) {
                    if (err) {
                        form.showError(err);

                        dialog.enableButtons();
                        inProgress = false;

                        return;
                    }

                    if (config.delegate) {
                        config.delegate.success();
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


        var onClose = function () {
            showSetPseudonymDialogShown = false;
            
            //events.trigger('refusedPseudonym');
            if (typeof callbacks.onClose === 'object') {
                callbacks.onClose();
            }
            
            if (config.delegate && typeof config.delegate.failure === 'function') {
                config.delegate.failure();
            }

            if (!inProgress) {
                logger.log('pseudonym refused');
            }
        };

        form.on('cancel', onClose);
        dialog.on('close', onClose);

        dialog.open();
    }
};


var showSettingsDialogShown = false;
/**
 * Shows the change pseudonym dialog.
 */
exports.showSettingsDialog = function (config, callbacks) {
    "use strict";

    if (showSettingsDialogShown === false) {
        if (!callbacks || typeof callbacks !== 'object') {
            throw new Error("Callbacks not provided.");
        }

        if (typeof callbacks.onSubmit) {
            throw new Error("Submit callback not provided.");
        }

        if (!config || typeof config !== 'object') {
            throw new Error("Configuration not provided.");
        }

        if (!config.user || config.user !== 'object') {
            throw new Error("User object not provided.");
        }

        if (!config.hasOwnProperty('auth')) {
            throw new Error("Auth object not provided.");
        }

        if (!config.auth || config.auth === 'expired') {
            exports.showInactivityMessage();
            return;
        }

        showSettingsDialogShown = true;
        var inProgress = false;


        var settings = config.auth && typeof config.auth === 'object' && config.auth.settings ? config.auth.settings : {};

        var currentPseudonym = "";
        if (config.auth && typeof config.auth === 'object' && config.auth.displayName) {
            currentPseudonym = config.auth.displayName;
        }

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
                    currentSettings: settings
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

                callbacks.onSubmit(formData, config.user, function (err) {
                    if (err) {
                        form.showError(err);

                        dialog.enableButtons();
                        inProgress = false;

                        return;
                    }

                    if (config.delegate) {
                        config.delegate.success();
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

        var onClose = function () {
            showSettingsDialogShown = false;

            if (typeof callbacks.onClose === 'function') {
                callbacks.onClose();
            }
        };

        dialog.on('close', onClose);
        form.on('cancel', onClose);

        dialog.open();
    }
};


var showEmailAlertDialogShown = false;
/**
 * Shows a dialog with email alert settings only.
 * Once the user saves their settings, a flag is set not to show this dialog again.
 */
exports.showEmailAlertDialog = function (config, callbacks) {
    "use strict";

    if (showEmailAlertDialogShown === false) {
        if (!callbacks || typeof callbacks !== 'object') {
            throw new Error("Callbacks not provided.");
        }

        if (typeof callbacks.onSubmit) {
            throw new Error("Submit callback not provided.");
        }

        if (!config || typeof config !== 'object') {
            throw new Error("Configuration not provided.");
        }

        if (!config.user || config.user !== 'object') {
            throw new Error("User object not provided.");
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

                callbacks.onSubmit(formData, config.user, function (err) {
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

        var onCancelClose = function () {
            showEmailAlertDialogShown = false;

            if (typeof callbacks.onClose === 'function') {
                callbacks.onClose();
            }
        };

        dialog.on('close', onCancelClose);
        form.on('cancel', onCancelClose);

        dialog.open();
    }
};


var showInactivityMessageDialogShown = false;
/**
 * Shows inactivity message when the user's session is expired.
 */
exports.showInactivityMessage = function (callbacks) {
    "use strict";

    if (showInactivityMessageDialogShown === false) {
        if (!callbacks || typeof callbacks !== 'object') {
            throw new Error("Callbacks not provided.");
        }

        if (typeof callbacks.onSubmit) {
            throw new Error("Submit callback not provided.");
        }

        showInactivityMessageDialogShown = true;

        var form = new Form(
            {
                method: 'GET',
                action: 'https://registration.ft.com/registration/barrier/login?location='+ encodeURIComponent(document.location.href),
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
            callbacks.onSubmit();
            //window.location.href = 'https://registration.ft.com/registration/barrier/login?location='+ encodeURIComponent(document.location.href);

            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }

            return false;
        });

        var onCancelClose = function () {
            showInactivityMessageDialogShown = false;
        };

        dialog.on('close', onCancelClose);
        form.on('cancel', onCancelClose);

        dialog.open();
    }
};
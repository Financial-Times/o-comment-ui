var logger = require('js-logger');

module.exports = {
    /**
     * Widget.js exposed.
     * @type {object}
     */
    Widget: require('./src/javascripts/Widget.js'),

    i18n: require('./src/javascripts/i18n.js'),
    templates: require('./src/javascripts/templates.js'),
    Ui: require('./src/javascripts/Ui.js'),
    uiUtils: require('./src/javascripts/uiUtils.js'),
    commonUi: require('./src/javascripts/commonUi.js'),
    formBuilder: {
        Form: require('./src/javascripts/form_builder/Form.js'),
        formFragments: require('./src/javascripts/form_builder/formFragments.js')
    },
    dialog: {
        Dialog: require('./src/javascripts/dialog/Dialog.js'),
        modal: require('./src/javascripts/dialog/modal.js')
    },

    /**
     * Enables logging.
     * @type {function}
     */
    enableLogging: function () {
        "use strict";
        logger.enable.apply(this, arguments);
    },

    /**
     * Disables logging.
     * @type {function}
     */
    disableLogging: function () {
        "use strict";
        logger.disable.apply(this, arguments);
    },

    /**
     * Sets logging level.
     * @type {number|string}
     */
    setLoggingLevel: function () {
        "use strict";
        logger.setLevel.apply(this, arguments);
    }
};
var logger = require('js-logger');

/**
 * Exports of submodules
 */

exports.Widget = require('./src/javascripts/Widget.js');
exports.WidgetUi = require('./src/javascripts/WidgetUi.js');
exports.userDialogs = require('./src/javascripts/userDialogs.js');

exports.i18n = require('./src/javascripts/i18n.js');
exports.templates = require('./src/javascripts/templates.js');
exports.utils = require('./src/javascripts/utils.js');

exports.form = {
    Form: require('./src/javascripts/form_builder/Form.js'),
    formFragments: require('./src/javascripts/form_builder/formFragments.js')
};
exports.dialog = {
    Dialog: require('./src/javascripts/dialog/Dialog.js'),
    modal: require('./src/javascripts/dialog/modal.js')
};

/**
 * Enables logging.
 * @type {function}
 */
exports.enableLogging = function () {
    "use strict";
    logger.enable.apply(this, arguments);
};

/**
 * Disables logging.
 * @type {function}
 */
exports.disableLogging = function () {
    "use strict";
    logger.disable.apply(this, arguments);
};

/**
 * Sets logging level.
 * @type {number|string}
 */
exports.setLoggingLevel = function () {
    "use strict";
    logger.setLevel.apply(this, arguments);
};
const oCommentUtilities = require('o-comment-utilities');

/**
 * Exports of submodules
 */

exports.Widget = require('./src/javascripts/Widget.js');
exports.WidgetUi = require('./src/javascripts/WidgetUi.js');
exports.userDialogs = require('./src/javascripts/userDialogs.js');
exports.utils = require('./src/javascripts/utils.js');

exports.i18n = require('./src/javascripts/i18n.js');
exports.templates = require('./src/javascripts/templates.js');

/**
 * Enables logging.
 * @return {undefined}
 */
exports.enableLogging = function () {
	oCommentUtilities.logger.enable.apply(this, arguments);
};

/**
 * Disables logging.
 * @return {undefined}
 */
exports.disableLogging = function () {
	oCommentUtilities.logger.disable.apply(this, arguments);
};

/**
 * Sets logging level.
 * @return {undefined}
 */
exports.setLoggingLevel = function () {
	oCommentUtilities.logger.setLevel.apply(this, arguments);
};

const hogan = require('hogan');

/**
 * Mustache templates, compiled but not rendered.
 * @type {Object}
 */
module.exports = {
	unavailableTemplate: hogan.compile(require('../templates/unavailable.html')),
	authUnavailableTemplate: hogan.compile(require('../templates/authUnavailable.html')),
	termsAndGuidelinesTemplate: hogan.compile(require('../templates/termsAndGuidelines.html')),
	clearLine: hogan.compile(require('../templates/clearLine.html')),
	commentingSettingsLink: hogan.compile(require('../templates/commentingSettingsLink.html')),
	environmentDisplay: hogan.compile(require('../templates/environmentDisplay.html')),
};

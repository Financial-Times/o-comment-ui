const hogan = require('hogan');

/**
 * Mustache templates, compiled but not rendered.
 * @type {Object}
 */
module.exports = {
	unavailableTemplate: hogan.compile(requireText('../templates/unavailable.ms')),
	authUnavailableTemplate: hogan.compile(requireText('../templates/authUnavailable.ms')),
	termsAndGuidelinesTemplate: hogan.compile(requireText('../templates/termsAndGuidelines.ms')),
	clearLine: hogan.compile(requireText('../templates/clearLine.ms')),
	commentingSettingsLink: hogan.compile(requireText('../templates/commentingSettingsLink.ms')),
	environmentDisplay: hogan.compile(requireText('../templates/environmentDisplay.ms')),
};

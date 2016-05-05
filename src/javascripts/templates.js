const templatingEngine = require('./templatingEngine');

/**
 * Mustache templates, compiled but not rendered.
 * @type {Object}
 */
module.exports = {
	unavailableTemplate: templatingEngine.compile(requireText('../templates/unavailable.ms')),
	authUnavailableTemplate: templatingEngine.compile(requireText('../templates/authUnavailable.ms')),
	termsAndGuidelinesTemplate: templatingEngine.compile(requireText('../templates/termsAndGuidelines.ms')),
	clearLine: templatingEngine.compile(requireText('../templates/clearLine.ms')),
	commentingSettingsLink: templatingEngine.compile(requireText('../templates/commentingSettingsLink.ms')),
	environmentDisplay: templatingEngine.compile(requireText('../templates/environmentDisplay.ms')),
};

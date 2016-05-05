const templatingEngine = require('./templatingEngine');

/**
 * Mustache templates, compiled but not rendered.
 * @type {Object}
 */
module.exports = {
	unavailableTemplate: templatingEngine.compile(requireText('../templates/unavailable.html')),
	authUnavailableTemplate: templatingEngine.compile(requireText('../templates/authUnavailable.html')),
	termsAndGuidelinesTemplate: templatingEngine.compile(requireText('../templates/termsAndGuidelines.html')),
	clearLine: templatingEngine.compile(requireText('../templates/clearLine.html')),
	commentingSettingsLink: templatingEngine.compile(requireText('../templates/commentingSettingsLink.html')),
	environmentDisplay: templatingEngine.compile(requireText('../templates/environmentDisplay.html')),
};

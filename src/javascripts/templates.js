const templatingEngine = require('./templatingEngine');

/**
 * Mustache templates, compiled but not rendered.
 * @type {Object}
 */
module.exports = {
	unavailableTemplate: templatingEngine.compile(require('../templates/unavailable.html')),
	authUnavailableTemplate: templatingEngine.compile(require('../templates/authUnavailable.html')),
	termsAndGuidelinesTemplate: templatingEngine.compile(require('../templates/termsAndGuidelines.html')),
	clearLine: templatingEngine.compile(require('../templates/clearLine.html')),
	commentingSettingsLink: templatingEngine.compile(require('../templates/commentingSettingsLink.html')),
	environmentDisplay: templatingEngine.compile(require('../templates/environmentDisplay.html')),
};

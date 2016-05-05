const templatingEngine = require('./templatingEngine');

/**
 * Mustache templates, compiled but not rendered.
 * @type {Object}
 */
module.exports = {
	unavailableTemplate: templatingEngine.compile(require('../templates/unavailable.ms')),
	authUnavailableTemplate: templatingEngine.compile(require('../templates/authUnavailable.ms')),
	termsAndGuidelinesTemplate: templatingEngine.compile(require('../templates/termsAndGuidelines.ms')),
	clearLine: templatingEngine.compile(require('../templates/clearLine.ms')),
	commentingSettingsLink: templatingEngine.compile(require('../templates/commentingSettingsLink.ms')),
	environmentDisplay: templatingEngine.compile(require('../templates/environmentDisplay.ms')),
};

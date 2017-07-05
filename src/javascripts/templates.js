const templatingEngine = require('./templatingEngine');

/**
 * Mustache templates, compiled but not rendered.
 * @type {Object}
 */
module.exports = {
	unavailableTemplate: templatingEngine.compile(require('../templates/unavailable.txt')),
	authUnavailableTemplate: templatingEngine.compile(require('../templates/authUnavailable.txt')),
	termsAndGuidelinesTemplate: templatingEngine.compile(require('../templates/termsAndGuidelines.txt')),
	clearLine: templatingEngine.compile(require('../templates/clearLine.txt')),
	commentingSettingsLink: templatingEngine.compile(require('../templates/commentingSettingsLink.txt')),
	environmentDisplay: templatingEngine.compile(require('../templates/environmentDisplay.txt')),
};

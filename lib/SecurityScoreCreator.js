const countNodeJsUnusedDependencies = require('./util/js-dependency-check');
const buildPath = require('./util/build-path');
const Logger = require('./Logger');
const { SUPPORTED_LANGUAGES } = require('./constants');

module.exports = class SecurityScoreCreator {
  constructor(language) {
    this.language = language;
  }

  scoreRepo(repoInfo) {
    if (!repoInfo) {
      return null;
    }

    if (this.language === SUPPORTED_LANGUAGES.JAVASCRIPT) {
      try {
        Logger.info(`Computing score for ${repoInfo.name}.`);
        return countNodeJsUnusedDependencies(buildPath(repoInfo.name));
      } catch (err) {
        Logger.warn(`No package information available for ${repoInfo.name}.`);
      }
    }
    return null;
  }
};

const trendingScraper = require('trending-github');
const SecurityScoreCreator = require('./SecurityScoreCreator');
const Logger = require('./Logger');
const validateCliArgs = require('./util/validate-cli-args');
const cloneRepo = require('./util/clone-repo');
const mergeScoresHelper = require('./util/merge-scores');
const { SUPPORTED_TIME_PERIODS, SUPPORTED_LANGUAGES } = require('./constants');

module.exports = class TrendingScraper {
  constructor({
    language = SUPPORTED_LANGUAGES.JAVASCRIPT,
    period = SUPPORTED_TIME_PERIODS.WEEKLY,
  }) {
    validateCliArgs({ language, period });
    this.language = language;
    this.period = period;
    this.scraper = trendingScraper;
    this.scoreCreator = new SecurityScoreCreator(language);
    this.results = [];
  }

  async run() {
    await this.fetchList();
    await this.cloneRepos(10);
    await this.scoreRepos(10);
    this.orderReposByScore();
    this.printResults();
  }

  async fetchList() {
    Logger.start('Fetching trending repos from GitHub. Please wait...');
    this.results = await this.scraper(this.period, this.language);
    Logger.success(`${this.results.length} results found.`);
  }

  async cloneRepos(resultsPerIteration, startIndex = 0) {
    const lastIndex = startIndex + resultsPerIteration - 1;
    Logger.info(`Cloning repos ${startIndex} to ${lastIndex} in results...`);

    const fetchPromises = this.results.slice(startIndex, lastIndex).map(cloneRepo);
    const cloneResults = await Promise.all(fetchPromises);
    const numberCloned = cloneResults.filter(output => output);

    if (numberCloned.length > 0) {
      Logger.success(`Cloned/updated ${numberCloned.length} repos.`);
    } else {
      Logger.warn(`No repos could be cloned/updated on this iteration.`);
    }

    if (lastIndex <= this.results.length) {
      await this.cloneRepos(resultsPerIteration, lastIndex);
    }
  }

  async scoreRepos(resultsPerIteration, startIndex = 0) {
    const lastIndex = startIndex + resultsPerIteration - 1;
    Logger.info(`Scoring repos ${startIndex} to ${lastIndex} in results...`);

    const scorePromises = this.results
      .slice(startIndex, lastIndex)
      .map(repoInfo => this.scoreCreator.scoreRepo(repoInfo));
    const scores = await Promise.all(scorePromises);
    const amountScored = scores.filter(output => output !== null);

    this.results = this.results.map((repoInfo, index) =>
      mergeScoresHelper({
        repoInfo,
        index,
        startIndex,
        lastIndex,
        scores,
      })
    );

    if (scores.length > 0) {
      Logger.success(`Scored ${amountScored.length} repos.`);
    } else {
      Logger.warn(`No repos could be scored on this iteration.`);
    }

    if (lastIndex <= this.results.length) {
      await this.scoreRepos(resultsPerIteration, lastIndex);
    }
  }

  orderReposByScore() {
    this.results = this.results.sort(
      (a, b) => (b.score !== null) - (a.score !== null) || a.score - b.score
    );
  }

  printResults() {
    Logger.start(`Displaying ${this.results.length} filtered from best to worst security score.`);
    console.table(
      this.results
        .filter(repoInfo => repoInfo)
        .map(repoInfo => ({
          name: repoInfo.name,
          score: repoInfo.score === null ? { ...repoInfo, score: 'N/A' } : repoInfo.score,
        }))
    );
  }
};

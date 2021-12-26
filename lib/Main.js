const process = require('process');
const Logger = require('./Logger');
const TrendingScraper = require('./TrendingScraper');

module.exports = class Main {
  static async init({ language, period }) {
    try {
      await new TrendingScraper({ language, period }).run();
    } catch (err) {
      Logger.error('An error ocurred, exiting...', err);
      process.exit(1);
    }
  }
};

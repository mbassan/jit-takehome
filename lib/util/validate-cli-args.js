const Logger = require('../Logger');
const { SUPPORTED_TIME_PERIODS, SUPPORTED_LANGUAGES } = require('../constants');

function validateCliArgs({ language, period }) {
  if (!Object.values(SUPPORTED_LANGUAGES).includes(language)) {
    Logger.error(
      `Scoring not supported for language: ${language}. Allowed values: ${JSON.stringify(
        Object.values(SUPPORTED_LANGUAGES)
      )}`
    );
    process.exit(1);
  }

  if (!Object.values(SUPPORTED_TIME_PERIODS).includes(period)) {
    Logger.error(
      `Scoring not supported for time period: ${period}. Allowed values: ${JSON.stringify(
        Object.values(SUPPORTED_TIME_PERIODS)
      )}`
    );
    process.exit(1);
  }
}

module.exports = validateCliArgs;

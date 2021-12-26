const moment = require('moment');
const colors = require('colors');
colors.enabled = true;

module.exports = class Logger {
  static start(message) {
    message = this.stringify(message);
    console.log('\n[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']', message.underline.cyan, '\n');
  }

  static info(message) {
    message = this.stringify(message);
    console.log('[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']', ' Info '.bgCyan.white, message);
  }

  static success(message) {
    message = this.stringify(message);
    console.log(
      '[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']',
      ' Success '.bgGreen.white,
      message
    );
  }

  static warn(message, err) {
    message = this.stringify(message);
    console.log(
      '[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']',
      ' Warn '.bgYellow.white,
      message,
      err || ''
    );
  }

  static error(message, err) {
    message = this.stringify(message);
    console.log(
      '[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']',
      ' Error '.bgRed.white,
      message,
      err || ''
    );
  }

  static stringify(message) {
    if (typeof message == 'object') message = JSON.stringify(message);

    return message;
  }
};

const { exec } = require('child_process');

const execCommand = async cmd => {
  return new Promise(resolve => {
    exec(cmd, (err, stdout) => {
      if (err) {
        resolve(err.toString());
        return;
      }
      resolve(stdout.trim());
    });
  });
};

module.exports = execCommand;

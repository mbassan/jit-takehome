const { existsSync } = require('fs');
const execCommand = require('./exec-command');
const buildPath = require('./build-path');
const Logger = require('../Logger');

async function exists(path) {
  return existsSync(path);
}

async function pullRepo(path) {
  return execCommand(`cd ${path} && git pull --all`);
}

async function cloneRepo(repoInfo) {
  const path = buildPath(repoInfo.name);
  const repoExists = await exists(path);

  if (repoExists) {
    Logger.info(`Updating ${repoInfo.name}`);
    return pullRepo(path);
  }

  try {
    Logger.info(`Cloning ${repoInfo.name}`);
    return execCommand(
      `mkdir ${path} && cd ${path} && git clone ${repoInfo.href} . \
      && git config user.email "nobody@nobody.com" \
      && git config user.name "nobody" \
      && git config branch.autoSetupMerge always`
    );
  } catch (error) {
    return false;
  }
}

module.exports = cloneRepo;

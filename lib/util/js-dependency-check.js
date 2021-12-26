const {
  promises: { readdir },
} = require('fs');
const execCommand = require('./exec-command');

const FAILURE_TEXT = 'fail';
const START_CHAR = ':';

async function listDirectories(path) {
  const directories = await readdir(path, { withFileTypes: true });
  return directories.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name) ?? [];
}

function hasUnusedDependencies(output) {
  return output.toLowerCase().includes(FAILURE_TEXT);
}

function grepPackageList(output) {
  const start = output.indexOf(START_CHAR);
  return output.substring(start + 1).split(',');
}

async function countNodeJsUnusedDependencies(path) {
  const directoriesInPath = await listDirectories(path);
  const searchPaths = ['./*.js', ...directoriesInPath];
  const output = await execCommand(
    `cd ${path} && npx dependency-check package.json ${searchPaths.join(' ')} --unused`
  );

  if (!output) {
    return null;
  }

  if (hasUnusedDependencies(output)) {
    return grepPackageList(output).length;
  }
}

module.exports = countNodeJsUnusedDependencies;

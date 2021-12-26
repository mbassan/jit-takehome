function buildPath(localDirectoryName) {
  const dir = __dirname.replace('/util', '').replace('/lib', '');
  return `${dir}/cache/${localDirectoryName}`;
}

module.exports = buildPath;

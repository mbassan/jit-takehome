function mergeScoresHelper({ repoInfo, index, startIndex, lastIndex, scores }) {
  if (index >= startIndex && index < lastIndex) {
    return { ...repoInfo, score: scores[index - startIndex] };
  }
  return repoInfo;
}

module.exports = mergeScoresHelper;

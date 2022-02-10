import latinize from 'latinize';

export interface SimilarityMatch {
  word: string;
  similarity: number;
}

const getBigrams = (str: string): Set<string> => {
  const bigrams = new Set<string>();

  for (let i = 0; i < str.length - 1; ++i) {
    bigrams.add(str.substring(i, i + 2));
  }

  return bigrams;
};

const intersect = <T = any>(first: Set<T>, second: Set<T>): Set<T> => {
  return new Set<T>([...first].filter((x) => second.has(x)));
};

export const getSimilarity = (first: string, second: string): number => {
  first = latinize(first)
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  second = second.toLowerCase().replace(/[^a-z]/g, '');

  if (first === second) {
    return 1;
  }

  if (first.length < 2 || second.length < 2) {
    return 0;
  }

  const firstBigrams = getBigrams(first);
  const secondBigrams = getBigrams(second);

  const intersection = intersect(firstBigrams, secondBigrams);

  return (2 * intersection.size) / (firstBigrams.size + secondBigrams.size);
};

export const getPhraseLikelihood = (
  content: string,
  phrase: string,
): SimilarityMatch => {
  const phraseComponents = phrase.split(' ');
  const contentComponents = content.split(/\s/g).filter((c) => c.length > 0);

  let maxSimilarityMatch: SimilarityMatch = {
    word: '',
    similarity: 0,
  };

  for (let i = 0; i < contentComponents.length; ++i) {
    const ngrams = contentComponents.slice(i, i + phraseComponents.length);

    if (ngrams.length !== phraseComponents.length) {
      break;
    }

    const stringToCompare = ngrams.join(' ');
    const similarity = getSimilarity(stringToCompare, phrase);

    if (similarity > maxSimilarityMatch.similarity) {
      maxSimilarityMatch.similarity = similarity;
      maxSimilarityMatch.word = stringToCompare;
    }
  }

  return maxSimilarityMatch;
};

import Levenshtein from 'levenshtein';

import fp, { map, identity, reduce, filter, find, compact } from 'lodash/fp';

export const STARTS_WITH = 'STARTS_WITH';
export const ENDS_WITH = 'ENDS_WITH';
export const CONTAINS = 'CONTAINS';
export const RHYMES_WITH = 'RHYMES_WITH';
export const DOUBLE_LETTER = 'DOUBLE_LETTER';
export const DOUBLE_VOWEL = 'DOUBLE_VOWEL';
export const DOUBLE_CONSONANT = 'DOUBLE_CONSONANT';
export const LENGTH_MIN = 'LENGTH_MIN';
export const LENGTH_MAX = 'LENGTH_MAX';
export const LENGTH_EXACT = 'LENGTH_EXACT';

export const FILTER_TYPES = [
  {
    type: STARTS_WITH,
    abbrevation: 'sw',
    label: 'Alkaa',
    multiple: false,
  },
  {
    type: ENDS_WITH,
    abbrevation: 'ew',
    label: 'Loppuu',
    multiple: false,
  },
  {
    type: CONTAINS,
    abbrevation: 'c',
    label: 'Sisältää',
    multiple: false,
  },
  {
    type: RHYMES_WITH,
    abbrevation: 'r',
    label: 'Riimipari',
    multiple: false,
  },
  {
    type: DOUBLE_LETTER,
    abbrevation: 't',
    label: 'Tupla',
    multiple: false,
  },
  {
    type: DOUBLE_VOWEL,
    abbrevation: 'pv',
    label: 'Pitkä vokaali',
    multiple: false,
  },
  {
    type: DOUBLE_CONSONANT,
    abbrevation: 'kk',
    label: 'Kaksoiskonsonantti',
    multiple: false,
  },
  {
    type: LENGTH_MIN,
    abbrevation: 'min',
    label: 'Pituus vähintään',
    multiple: false,
  },
  {
    type: LENGTH_MAX,
    abbrevation: 'max',
    label: 'Pituus enintään',
    multiple: false,
  },
  {
    type: LENGTH_EXACT,
    abbrevation: 'len',
    label: 'Pituus tasan',
    multiple: false,
  },
];

export const findTypeByAbbrevation = abbrevation => find({ abbrevation })(FILTER_TYPES).type;

const addAbbrevation = (res, fltr) => Object.assign(res, { [fltr.type]: filter.abbrevation });

export const ABBREVATIONS = reduce(addAbbrevation, {})(FILTER_TYPES);

export const FILTER_SERIALIZERS = {
  [STARTS_WITH]: opts => opts.phrase,
  [ENDS_WITH]: opts => opts.phrase,
  [CONTAINS]: opts => opts.phrase,
  [RHYMES_WITH]: opts => opts.phrase,
  [DOUBLE_LETTER]: opts => opts.letters || '',
  [DOUBLE_VOWEL]: () => '',
  [DOUBLE_CONSONANT]: () => '',
  [LENGTH_MIN]: opts => opts.length,
  [LENGTH_MAX]: opts => opts.length,
  [LENGTH_EXACT]: opts => opts.length,
};

export const FILTER_DESERIALIZERS = {
  [ABBREVATIONS[STARTS_WITH]]: phrase => ({ phrase }),
  [ABBREVATIONS[ENDS_WITH]]: phrase => ({ phrase }),
  [ABBREVATIONS[CONTAINS]]: phrase => ({ phrase }),
  [ABBREVATIONS[RHYMES_WITH]]: phrase => ({ phrase }),
  [ABBREVATIONS[DOUBLE_LETTER]]: letters => ({ letters }),
  [ABBREVATIONS[DOUBLE_VOWEL]]: () => ({}),
  [ABBREVATIONS[DOUBLE_CONSONANT]]: () => ({}),
  [ABBREVATIONS[LENGTH_MIN]]: length => ({ length: parseInt(length, 10) }),
  [ABBREVATIONS[LENGTH_MAX]]: length => ({ length: parseInt(length, 10) }),
  [ABBREVATIONS[LENGTH_EXACT]]: length => ({ length: parseInt(length, 10) }),
};

const reduceWithKey = fp.reduce.convert({ cap: false });

const startsWith = opts => word => word.startsWith(opts.phrase.toLowerCase());
const endsWith = opts => word => word.endsWith(opts.phrase.toLowerCase());
const contains = opts => word => word.indexOf(opts.phrase.toLowerCase()) !== -1;
const rhymesWith = opts => word => new Levenshtein(word, opts.word.toLowerCase()).distance === 1;
const doubleLetter = (opts) => {
  const matcher = new RegExp(`([${opts.letters}])\\1`);
  return word => word.match(matcher);
};
const doubleVowel = () => word => word.match(/([aeiouyöä])\1/);
const doubleConsonant = () => word => word.match(/([bcdfghjklmnpqrstv])\1/);
const minLength = opts => word => word.length >= opts.length;
const maxLength = opts => word => word.length <= opts.length;
const exactLength = opts => word => word.length === opts.length;

const createPredicate = ({ type, opts }) => {
  switch (type) {
    case STARTS_WITH: return startsWith(opts);
    case ENDS_WITH: return endsWith(opts);
    case CONTAINS: return contains(opts);
    case RHYMES_WITH: return rhymesWith(opts);
    case DOUBLE_LETTER: return doubleLetter(opts);
    case DOUBLE_VOWEL: return doubleVowel(opts);
    case DOUBLE_CONSONANT: return doubleConsonant(opts);
    case LENGTH_MIN: return minLength(opts);
    case LENGTH_MAX: return maxLength(opts);
    case LENGTH_EXACT: return exactLength(opts);
    default: return identity;
  }
};

export function searchWords(words, filters) {
  const predicates = map(createPredicate)(filters);
  const reducer = reduce((res, predicate) => filter(predicate)(res), words);
  return compact(reducer(predicates));
}

const serializeFilter = (res, { type, opts }) => {
  const { abbrevation } = find({ type })(FILTER_TYPES);
  const value = FILTER_SERIALIZERS[type](opts);

  if (res[abbrevation]) {
    return Object.assign(res, { [abbrevation]: [].concat(res[abbrevation], value) });
  }

  return Object.assign(res, { [abbrevation]: value });
};

const deserializeFilter = (res, val, key, id) => res.concat({
  type: findTypeByAbbrevation(key),
  opts: FILTER_DESERIALIZERS[key](val),
  id,
});

export const serialize = filters => reduce(serializeFilter, {})(filters);

export const deserialize = params => reduceWithKey(deserializeFilter, [])(params);

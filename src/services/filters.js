import Levenshtein from 'levenshtein';

import fp, { map, identity, reduce, find, compact, noop } from 'lodash/fp';
import { isString } from 'lodash';

const TEXT = 'text';
const NUMBER = 'number';

const reduceWithKey = fp.reduce.convert({ cap: false });

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
    fields: { phrase: TEXT },
  },
  {
    type: ENDS_WITH,
    abbrevation: 'ew',
    label: 'Loppuu',
    multiple: false,
    fields: { phrase: TEXT },
  },
  {
    type: CONTAINS,
    abbrevation: 'c',
    label: 'Sisältää',
    multiple: false,
    fields: { phrase: TEXT },
  },
  {
    type: RHYMES_WITH,
    abbrevation: 'r',
    label: 'Riimipari',
    multiple: false,
    fields: { word: TEXT },
  },
  {
    type: DOUBLE_LETTER,
    abbrevation: 't',
    label: 'Tupla',
    multiple: false,
    fields: { letters: TEXT },
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
    fields: { length: NUMBER },
  },
  {
    type: LENGTH_MAX,
    abbrevation: 'max',
    label: 'Pituus enintään',
    multiple: false,
    fields: { length: NUMBER },
  },
  {
    type: LENGTH_EXACT,
    abbrevation: 'len',
    label: 'Pituus tasan',
    multiple: false,
    fields: { length: NUMBER },
  },
];

export const findByType = type => find({ type })(FILTER_TYPES);

export const findTypeByAbbrevation = abbrevation => find({ abbrevation })(FILTER_TYPES).type;

const addAbbrevation = (res, filter) => Object.assign(res, { [filter.type]: filter.abbrevation });

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
const minLength = opts => word => word.length >= parseInt(opts.length, 10);
const maxLength = opts => word => word.length <= parseInt(opts.length, 10);
const exactLength = opts => word => word.length === parseInt(opts.length, 10);

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

// #isValidField()
//    Validated a single filter option field.
//
const isValidField = (type, value) => {
  switch (type) {
    case TEXT: return isString(value) && value.length !== 0;
    case NUMBER: return parseInt(value, 10) > 0;
    default: return true;
  }
};

// #validateFilter()
//    Validates a single filter options.
//
const validateFilter = (filter) => {
  const fields = findByType(filter.type).fields;
  const valid = reduceWithKey((res, val, key) =>
    res && isValidField(val, filter.opts[key]), true)(fields);
  return Object.assign(filter, { valid });
};

// #validateFilters()
//    Validates all given filters and returns an filter array containing valid: (true|false)
//    value for each filter.
//
export const validateFilters = filters => map(validateFilter)(filters);

// #searchWords()
//    Filters words list with given filters.
//
export function searchWords(words, filters) {
  const predicates = map(createPredicate)(filters);
  const reducer = reduce((res, predicate) => fp.filter(predicate)(res), words);
  return compact(reducer(predicates));
}

// #serializeFilter()
//    Serializes filter options into a query parameter
//
export const serializeFilter = (res, { type, opts }) => {
  const { abbrevation } = find({ type })(FILTER_TYPES);
  const value = FILTER_SERIALIZERS[type](opts);

  if (res[abbrevation]) {
    return Object.assign(res, { [abbrevation]: [].concat(res[abbrevation], value) });
  }

  return Object.assign(res, { [abbrevation]: value });
};

// #deserializeFilter()
//    Deserializes filter from a query parameter
//
export const deserializeFilter = (res, val, key) => res.concat({
  type: findTypeByAbbrevation(key),
  opts: (FILTER_DESERIALIZERS[key] || noop)(val),
  id: res.length + 1,
});

// #serialize()
//    Serializes given filter array into a query parameter string.
//
export const serialize = filters => reduce(serializeFilter, {})(filters);

// #deserialize()
//    Deserializes an filter array from a query parameter string.
//
export const deserialize = params => reduceWithKey(deserializeFilter, [])(params);

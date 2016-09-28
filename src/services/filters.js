import Levenshtein from 'levenshtein';

import fp, { map, identity, reduce, filter, find, compact } from 'lodash/fp';
import {
  findTypeByAbbrevation,
  FILTER_TYPES,
  FILTER_SERIALIZERS,
  FILTER_DESERIALIZERS,
  STARTS_WITH,
  ENDS_WITH,
  CONTAINS,
  RHYMES_WITH,
  DOUBLE_VOWEL,
  DOUBLE_CONSONANT,
  LENGTH_MIN,
  LENGTH_MAX,
  LENGTH_EXACT,
} from '../constants/filter-types';

const reduceWithKey = fp.reduce.convert({ cap: false });

const startsWith = opts => word => word.toLowerCase().startsWith(opts.phrase.toLowerCase());
const endsWith = opts => word => word.toLowerCase().endsWith(opts.phrase.toLowerCase());
const contains = opts => word => word.toLowerCase().indexOf(opts.phrase.toLowerCase()) !== -1;
const rhymesWith = opts => word => new Levenshtein(word.toLowerCase(), opts.word.toLowerCase()).distance === 1;
const doubleVowel = () => word => word.toLowerCase().match(/([aeiouyöä])\1/);
const doubleConsonant = () => word => word.toLowerCase().match(/([bcdfghjklmnpqrstv])\1/);
const minLength = opts => word => word.toLowerCase().length >= opts.length;
const maxLength = opts => word => word.toLowerCase().length <= opts.length;
const exactLength = opts => word => word.toLowerCase().length === opts.length;

const createPredicate = ({ type, opts }) => {
  switch (type) {
    case STARTS_WITH: return startsWith(opts);
    case ENDS_WITH: return endsWith(opts);
    case CONTAINS: return contains(opts);
    case RHYMES_WITH: return rhymesWith(opts);
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

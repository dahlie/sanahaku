import { find, reduce } from 'lodash/fp';

export const STARTS_WITH = 'STARTS_WITH';
export const ENDS_WITH = 'ENDS_WITH';
export const CONTAINS = 'CONTAINS';
export const RHYMES_WITH = 'RHYMES_WITH';
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
    type: DOUBLE_VOWEL,
    abbrevation: 'tv',
    label: 'Pitkä vokaali',
    multiple: false,
  },
  {
    type: DOUBLE_CONSONANT,
    abbrevation: 'tk',
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

const addAbbrevation = (res, filter) => Object.assign(res, { [filter.type]: filter.abbrevation });

export const ABBREVATIONS = reduce(addAbbrevation, {})(FILTER_TYPES);

export const FILTER_SERIALIZERS = {
  [STARTS_WITH]: opts => opts.phrase,
  [ENDS_WITH]: opts => opts.phrase,
  [CONTAINS]: opts => opts.phrase,
  [RHYMES_WITH]: opts => opts.phrase,
  [DOUBLE_VOWEL]: opts => opts.letters || '',
  [DOUBLE_CONSONANT]: opts => opts.letters || '',
  [LENGTH_MIN]: opts => opts.length,
  [LENGTH_MAX]: opts => opts.length,
  [LENGTH_EXACT]: opts => opts.length,
};

export const FILTER_DESERIALIZERS = {
  [ABBREVATIONS[STARTS_WITH]]: phrase => ({ phrase }),
  [ABBREVATIONS[ENDS_WITH]]: phrase => ({ phrase }),
  [ABBREVATIONS[CONTAINS]]: phrase => ({ phrase }),
  [ABBREVATIONS[RHYMES_WITH]]: phrase => ({ phrase }),
  [ABBREVATIONS[DOUBLE_VOWEL]]: letters => ({ letters }),
  [ABBREVATIONS[DOUBLE_CONSONANT]]: letters => ({ letters }),
  [ABBREVATIONS[LENGTH_MIN]]: length => ({ length: parseInt(length, 10) }),
  [ABBREVATIONS[LENGTH_MAX]]: length => ({ length: parseInt(length, 10) }),
  [ABBREVATIONS[LENGTH_EXACT]]: length => ({ length: parseInt(length, 10) }),
};

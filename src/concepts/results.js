import { List, fromJS } from 'immutable';
import queryString from 'query-string';

import { searchWords, serialize } from '../services/filters';

const words = require('../suomi.json');

const SEARCH_WORDS = 'results/SEARCH_WORDS';
const CLEAR_RESULTS = 'results/CLEAR_RESULTS';

// Initial state
const initialState = fromJS({
  words: [],
  url: null,
});

// Selectors
export const getResultCount = state => state.getIn(['results', 'words', 'length'], 0);

export const getResults = state => state.getIn(['results', 'words'], new List());

export const getResultUrl = state => state.getIn(['results', 'url']);

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH_WORDS: {
      return fromJS({
        words: action.results,
        url: action.url,
      });
    }

    case CLEAR_RESULTS: {
      return initialState;
    }

    default:
      return state;
  }
}

// Action creators
export function filterWords(filters) {
  const results = searchWords(words, filters.toJS());
  const params = serialize(filters.toJS());

  return {
    type: SEARCH_WORDS,
    results,
    url: queryString.stringify(params),
  };
}

export const clearResults = () => ({
  type: CLEAR_RESULTS,
});

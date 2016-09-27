import { List, fromJS } from 'immutable';
import queryString from 'query-string';

import { searchWords, serialize } from '../services/filters';

const words = require('../suomi.json');

const START_SEARCH = 'results/START_SEARCH';
const SEARCH_COMPLETE = 'results/SEARCH_COMPLETE';
const CLEAR_RESULTS = 'results/CLEAR_RESULTS';

// Initial state
const initialState = fromJS({
  filtering: false,
  words: null,
  url: null,
});

// Selectors
export const getResultCount = state => state.getIn(['results', 'words', 'length'], 0);

export const getResults = state => state.getIn(['results', 'words'], new List());

export const getResultUrl = state => state.getIn(['results', 'url']);

export const isBusy = state => state.getIn(['results', 'filtering']);

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case START_SEARCH: {
      return state.set('filtering', true);
    }

    case SEARCH_COMPLETE: {
      return fromJS({
        words: action.results,
        url: action.url,
        filtering: false,
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
  return (dispatch) => {
    dispatch({ type: START_SEARCH });

    setTimeout(() => {
      const results = searchWords(words, filters.toJS());
      const params = serialize(filters.toJS());

      dispatch({
        type: SEARCH_COMPLETE,
        results,
        url: queryString.stringify(params),
      });
    }, 100);
  };
}

export const clearResults = () => ({
  type: CLEAR_RESULTS,
});

import { fromJS } from 'immutable';
import { every } from 'lodash/fp';

import { loadFilters, updateAll, getFilters } from './filters';
import { filterWords } from './words';

import { validateFilters } from '../services/filters';

const initialState = fromJS({});

export default function reducer(state = initialState) {
  return state;
}

const isValid = filter => filter.valid;

export const search = filters => (dispatch) => {
  const validated = validateFilters(filters.toJS());

  dispatch(updateAll(validated));

  if (every(isValid)(validated)) {
    return dispatch(filterWords(fromJS(validated)));
  }

  return Promise.resolve();
};

export const initialize = () => (dispatch, getState) => {
  if (!location.search) {
    return null;
  }

  dispatch(loadFilters(location.search));
  return dispatch(search(getFilters(getState())));
};

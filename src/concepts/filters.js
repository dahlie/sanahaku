import { fromJS } from 'immutable';
import queryString from 'query-string';

import { deserialize } from '../services/filters';

const ADD_FILTER = 'filters/ADD_FILTER';
const LOAD_FILTERS = 'filters/LOAD_FILTERS';
const REMOVE_FILTER = 'filters/REMOVE_FILTER';
const UPDATE_FILTER = 'filters/UPDATE_FILTER';
const UPDATE_ALL = 'filters/UPDATE_ALL';

// # findById()
//    Finds filter by id
//
const findIndexById = (state, id) => state.findIndex(filter => filter.get('id') === id);

// Initial state
const initialState = fromJS([]);

// Selectors
//
export const getFilters = state => state.get('filters');

// Reducer
//
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_FILTER: {
      return state.push(fromJS({
        type: action.filterType,
        opts: {},
        valid: true,
      }));
    }

    case UPDATE_ALL:
    case LOAD_FILTERS: {
      return fromJS(action.filters);
    }

    case UPDATE_FILTER: {
      return state.update(action.index, filter => filter.mergeIn(['opts'], action.opts));
    }

    case REMOVE_FILTER: {
      return state.splice(action.index, 1);
    }

    default:
      return state;
  }
}

export const addFilter = type => ({
  type: ADD_FILTER,
  filterType: type,
});

export const removeFilter = index => ({
  type: REMOVE_FILTER,
  index,
});

export const updateFilter = (index, opts) => ({
  type: UPDATE_FILTER,
  index,
  opts,
});

export const updateAll = filters => ({
  type: UPDATE_ALL,
  filters,
});

export const loadFilters = (query) => {
  const filters = deserialize(queryString.parse(query));
  return { type: LOAD_FILTERS, filters };
};

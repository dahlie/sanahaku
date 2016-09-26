import { fromJS } from 'immutable';
import queryString from 'query-string';

import { deserialize } from '../services/filters';

const ADD_FILTER = 'filters/ADD_FILTER';
const LOAD_FILTERS = 'filters/LOAD_FILTERS';
const REMOVE_FILTER = 'filters/REMOVE_FILTER';
const UPDATE_FILTER = 'filters/UPDATE_FILTER';

// Static counter for assigning unique IDs for filters
let nextId = 1;

// # findById()
//    Finds filter by id
//
const findIndexById = (state, id) => state.findIndex(filter => filter.get('id') === id);

const initialState = fromJS([]);

// # reducer()
//
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_FILTER: {
      return state.push(fromJS({
        id: nextId++,
        type: action.filterType,
        opts: {},
      }));
    }

    case LOAD_FILTERS: {
      return fromJS(action.filters);
    }

    case UPDATE_FILTER: {
      return state.update(
        findIndexById(state, action.id),
        filter => filter.mergeIn(['opts'], action.opts)
      );
    }

    case REMOVE_FILTER: {
      const index = findIndexById(state, action.id);
      return index !== -1 ? state.splice(index, 1) : state;
    }

    default:
      return state;
  }
}

export const addFilter = type => ({
  type: ADD_FILTER,
  filterType: type,
});

export const removeFilter = id => ({
  type: REMOVE_FILTER,
  id,
});

export const updateFilter = (id, opts) => ({
  type: UPDATE_FILTER,
  id,
  opts,
});

export const loadFilters = query => ({
  type: LOAD_FILTERS,
  filters: deserialize(queryString.parse(query)),
});

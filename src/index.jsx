import immutable from 'immutable';
import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './containers/App';

import filters from './concepts/filters';
import results from './concepts/results';

const rootReducer = combineReducers({
  filters,
  results
});

let store = createStore(rootReducer);

require('./styles/global.styl');
require('./assets/fonts/_icons.styl');

// Not in production mode so activate some dev tools
if (ENV !== 'production') {
  require('immutable-devtools')(immutable);
  store = createStore(rootReducer, window.devToolsExtension && window.devToolsExtension());
}

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

import immutable, { Map } from 'immutable';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './containers/App';

import filters from './concepts/filters';
import words from './concepts/words';
import app from './concepts/app';

const rootReducer = combineReducers({
  filters,
  words,
  app
});

require('./styles/global.styl');
require('./assets/fonts/_icons.styl');

let enhancer = compose(applyMiddleware(thunk));

// Not in production mode so activate some dev tools
if (ENV !== 'production') {
  require('immutable-devtools')(immutable);

  if (window.devToolsExtension) {
    enhancer = compose(
      applyMiddleware(thunk),
      window.devToolsExtension && window.devToolsExtension()
    );
  }
}

const store = createStore(rootReducer, new Map(), enhancer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

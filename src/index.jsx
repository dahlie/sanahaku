import immutable, { Map } from 'immutable';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import ReactGA from 'react-ga';

import App from './containers/App';

import filters from './concepts/filters';
import words from './concepts/words';
import app from './concepts/app';

// Initialize Google analytics
ReactGA.initialize('UA-85011800-1');

// Initialize logging
Raven.config('https://d165b654e05c4d379c7fd7b6a58813d7@sentry.io/103639').install();

const rootReducer = combineReducers({
  filters,
  words,
  app,
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

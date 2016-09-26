import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import CSSModules from 'react-css-modules';

import styles from './results.styl';

const Results = ({ words, maxResults, url }) => !words.isEmpty() && (
  <div>
    <h2>Tulokset ({words.size > maxResults ? `${maxResults}+` : words.size} kpl)</h2>

    <div styleName="container">
      {words.take(maxResults).toJS().join(', ')}
      {words.size > maxResults && '...'}
    </div>

    <div styleName="link">
      <a href={`/?${url}`}>Tallennettu hakutulos</a>
    </div>
  </div>
);

Results.propTypes = {
  words: ImmutablePropTypes.list,
  maxResults: PropTypes.number,
  url: PropTypes.string,
};

Results.defaultProps = {
  words: new List(),
  maxResults: 100,
};

export default CSSModules(Results, styles);

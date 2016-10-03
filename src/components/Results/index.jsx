import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import CSSModules from 'react-css-modules';

import styles from './results.styl';

const Results = ({ words, maxResults, resultsUrl }) => {
  if (!words) {
    return null;
  }

  if (words.isEmpty()) {
    return (<div><h2>Ei osumia</h2></div>);
  }

  const url = `${window.location.origin}/?${resultsUrl}`;

  return (
    <div>
      <h2>Tulokset ({words.size > maxResults ? `${maxResults}+` : words.size} kpl)</h2>

      <div styleName="container">
        {words.take(maxResults).toJS().join(', ')}
        {words.size > maxResults && '...'}
      </div>

      <div styleName="link">
        <a href={url}>Linkki tähän hakutulokseen</a>
      </div>
    </div>
  );
};

Results.propTypes = {
  words: ImmutablePropTypes.list,
  maxResults: PropTypes.number,
  resultsUrl: PropTypes.string,
};

Results.defaultProps = {
  words: new List(),
  maxResults: 100,
};

export default CSSModules(Results, styles);

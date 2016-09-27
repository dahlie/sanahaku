import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import CSSModules from 'react-css-modules';

import Button from '../Button';

import styles from './results.styl';

const Results = ({ words, maxResults, currentUrl, resultsUrl, onSave }) => {
  if (!words) {
    return null;
  }

  if (words.isEmpty()) {
    return (<div><h2>Ei osumia</h2></div>);
  }

  return (
    <div>
      <h2>Tulokset ({words.size > maxResults ? `${maxResults}+` : words.size} kpl)</h2>

      <div styleName="container">
        {words.take(maxResults).toJS().join(', ')}
        {words.size > maxResults && '...'}
      </div>

      <div styleName="buttons">
        {currentUrl !== resultsUrl &&
        <Button type="primary" onClick={onSave}>Tallenna hakutulos</Button>
        }
        {false && <Button type="primary">Uusi haku</Button>}
      </div>
    </div>
  );
};

Results.propTypes = {
  words: ImmutablePropTypes.list,
  maxResults: PropTypes.number,
  currentUrl: PropTypes.string,
  resultsUrl: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

Results.defaultProps = {
  words: new List(),
  maxResults: 100,
};

export default CSSModules(Results, styles);

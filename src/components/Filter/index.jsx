import last from 'lodash/fp/last';
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CSSModules from 'react-css-modules';
import autobind from 'autobind-decorator';

import Icon from '../Icon';

import {
  STARTS_WITH,
  ENDS_WITH,
  CONTAINS,
  RHYMES_WITH,
  DOUBLE_VOWEL,
  DOUBLE_CONSONANT,
  LENGTH_MIN,
  LENGTH_MAX,
  LENGTH_EXACT
} from '../../constants/filter-types';

import styles from './filter.styl';

const onSingleChange = (key, callback) =>
  (e) =>
    callback(key, last(e.target.value));

// Filter for words starting with a certain phrase
const StartsWithFilter = CSSModules(({ opts, onChange }) => (
  <div>
    alkavat
    <input
      type="text"
      value={opts.phrase || ''}
      onChange={e => onChange('phrase', e.target.value)}
    />
  </div>
), styles);

// Filter for words ending to a certain phrase
const EndsWithFilter = CSSModules(({ opts, onChange }) => (
  <div>
    loppuvat
    <input
      type="text"
      value={opts.phrase || ''}
      onChange={e => onChange('phrase', e.target.value)}
    />
  </div>
), styles);

// Filter for words containing a certain phrase
const ContainsFilter = CSSModules(({ opts, onChange }) => (
  <div>
    sisältävät
    <input
      type="text"
      value={opts.phrase || ''}
      onChange={e => onChange('phrase', e.target.value)}
    />
  </div>
), styles);

// Filter for words rhyming with given word (levensthein distance 1)
const RhymesWithFilter = CSSModules(({ opts, onChange }) => (
  <div>
    ovat riimipareja sanan
    <input
      type="text"
      value={opts.word || ''}
      onChange={e => onChange('word', e.target.value)}
    />
    kanssa
  </div>
), styles);

// Filter for words containing double vowels
const DoubleVowelFilter = CSSModules(({ opts, onChange }) => (
  <div>
    sisältää pitkän vokaalin
  </div>
), styles);

// Filter for words containing double vowels
const DoubleConsonantFilter = CSSModules(({ opts, onChange }) => (
  <div>
    sisältää kaksoiskonsonantin
  </div>
), styles);

const LengthFilter = (label) => CSSModules(({ opts, onChange }) => (
  <div>
    {label}
    <input
      type="number"
      styleName="small"
      value={opts.length || ''}
      onChange={e => onChange('length', parseInt(e.target.value, 10))}
    />
    merkkiä pitkiä
  </div>
), styles);

// Filters for words lengths
const MinLengthFilter = LengthFilter('ovat vähintään');
const MaxLengthFilter = LengthFilter('ovat enintään');
const ExactLengthFilter = LengthFilter('ovat tasan');

// Remove filter button
const RemoveButton = ({ onClick, id }) => (
  <div style={{float: 'right', top: '-32px', position: 'relative'}} onClick={() => onClick(id)}>x</div>
);

const FILTER_MAPPING = {
  [STARTS_WITH]: <StartsWithFilter />,
  [ENDS_WITH]: <EndsWithFilter />,
  [CONTAINS]: <ContainsFilter />,
  [RHYMES_WITH]: <RhymesWithFilter />,
  [DOUBLE_VOWEL]: <DoubleVowelFilter />,
  [DOUBLE_CONSONANT]: <DoubleConsonantFilter />,
  [LENGTH_MIN]: <MinLengthFilter />,
  [LENGTH_MAX]: <MaxLengthFilter />,
  [LENGTH_EXACT]: <ExactLengthFilter />
};

@CSSModules(styles, { allowMultiple: false })
class Filter extends Component {

  static propTypes = {
    filter: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
  }

  @autobind
  onChange(key, value) {
    const { filter, onChange } = this.props;
    onChange(filter, { [key]: value });
  }

  @autobind
  onRemoveFilter() {
    const { filter, onRemove } = this.props;
    onRemove(filter);
  }

  renderFilter(filter) {
    const type = filter.get('type');
    const component = FILTER_MAPPING[type] || <div/>;

    return React.cloneElement(component, {
      ...filter.toJS(),
      onChange: this.onChange
    });
  }

  render() {
    const { filter } = this.props;

    return (
      <div styleName="filter">
        {this.renderFilter(filter)}
        <RemoveButton onClick={this.onRemoveFilter} />
      </div>
    );
  }
}

export default Filter;

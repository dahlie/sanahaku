import last from 'lodash/fp/last';
import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CSSModules from 'react-css-modules';
import autobind from 'autobind-decorator';
import classnames from 'classnames';

import Icon from '../Icon';

import {
  STARTS_WITH,
  ENDS_WITH,
  CONTAINS,
  RHYMES_WITH,
  DOUBLE_LETTER,
  DOUBLE_VOWEL,
  DOUBLE_CONSONANT,
  LENGTH_MIN,
  LENGTH_MAX,
  LENGTH_EXACT
} from '../../services/filters';

import styles from './filter.styl';

const onSingleChange = (key, callback) => e => callback(key, last(e.target.value));

const Input = CSSModules(({ field, opts = {}, onChange, styles, valid, ...rest }) => (
  <input
    autoFocus
    value={opts[field] || ''}
    onChange={e => onChange(field, e.target.value)}
    styleName={classnames({ invalid: !valid })}
    {...rest}
  />
), styles);

// Filter for words starting with a certain phrase
const StartsWithFilter = CSSModules(opts => (
  <div>
    alkavat <Input field="phrase" {...opts} />
  </div>
), styles);

// Filter for words ending to a certain phrase
const EndsWithFilter = CSSModules(opts => (
  <div>
    loppuvat <Input field="phrase" {...opts} />
  </div>
), styles);

// Filter for words containing a certain phrase
const ContainsFilter = CSSModules(opts => (
  <div>
    sisältävät <Input field="phrase" {...opts} />
  </div>
), styles);

// Filter for words rhyming with given word (levensthein distance 1)
const RhymesWithFilter = CSSModules(opts => (
  <div>
    ovat riimipareja sanan <Input field="word" {...opts} /> kanssa
  </div>
), styles);

// Filter for words containing double vowels
const DoubleVowelFilter = CSSModules(() => (
  <div>
    sisältävät minkä tahansa pitkän vokaalin
  </div>
), styles);

// Filter for words containing double vowels
const DoubleConsonantFilter = CSSModules(() => (
  <div>
    sisältävät minkä tahansa kaksoiskonsonantin
  </div>
), styles);

// Filter for words containing two same consecutive characters
const DoubleLetterFilter = CSSModules(opts => (
  <div>
    sisältävät jonkun kirjaimista <Input field="letters" {...opts} /> peräkkäin
  </div>
), styles);

const LengthFilter = (label) => CSSModules(opts => (
  <div>
    {label} <Input type="number" field="length" styleName="small" {...opts} /> kirjainta pitkiä
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
  [DOUBLE_LETTER]: <DoubleLetterFilter />,
  [DOUBLE_VOWEL]: <DoubleVowelFilter />,
  [DOUBLE_CONSONANT]: <DoubleConsonantFilter />,
  [LENGTH_MIN]: <MinLengthFilter />,
  [LENGTH_MAX]: <MaxLengthFilter />,
  [LENGTH_EXACT]: <ExactLengthFilter />
};

@CSSModules(styles, { allowMultiple: true })
class Filter extends Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    filter: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
  }

  @autobind
  onChange(key, value) {
    const { index, onChange } = this.props;
    onChange(index, { [key]: value });
  }

  @autobind
  onRemoveFilter() {
    const { index, onRemove } = this.props;
    onRemove(index);
  }

  renderFilter(filter) {
    const type = filter.get('type');
    const component = FILTER_MAPPING[type] || <div/>;
    const { onSearch, disabled } = this.props;

    return React.cloneElement(component, {
      ...filter.toJS(),
      onChange: this.onChange,
      onKeyDown: e => e.keyCode === 13 && onSearch(),
      disabled,
    });
  }

  render() {
    const { filter, disabled = false } = this.props;

    return (
      <div styleName={classnames('filter', { disabled })}>
        {this.renderFilter(filter)}
        <RemoveButton onClick={this.onRemoveFilter} />
      </div>
    );
  }
}

export default Filter;

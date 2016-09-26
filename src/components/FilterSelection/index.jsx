import React, { Component, PropTypes } from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CSSModules from 'react-css-modules';
import autobind from 'autobind-decorator';
import classnames from 'classnames';

import styles from './filter-selection.styl';

const Filter = CSSModules(({ type, label, disabled, onClick }) => (
  <div
    styleName={classnames('filter', { disabled })}
    onClick={() => !disabled && onClick(type)}
  >
    {label}
  </div>
), styles, { allowMultiple: true });

@CSSModules(styles)
export default class FilterSelection extends Component {

  static propTypes = {
    filterTypes: PropTypes.array.isRequired,
    selected: ImmutablePropTypes.list.isRequired,
    onSelectFilter: PropTypes.func.isRequired
  }

  shouldComponentUpdate = shouldComponentUpdate

  @autobind
  onSelectFilter(type) {
    this.props.onSelectFilter(type);
  }

  canSelectFilter(filter) {
    const { selected } = this.props;
    return filter.multiple || !selected.some(f => f.get('type') === filter.type);
  }

  render() {
    const { filterTypes } = this.props;

    return (
      <div styleName="container">
        <h2>Hakuehdot</h2>
        {filterTypes.map((filter, key) =>
          <Filter
            key={key}
            type={filter.type}
            label={filter.label}
            onClick={this.onSelectFilter}
            disabled={!this.canSelectFilter(filter)}
          />
        )}
      </div>
    );
  }
}

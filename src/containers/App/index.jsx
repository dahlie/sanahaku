import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import CSSModules from 'react-css-modules';
import autobind from 'autobind-decorator';

import Header from '../../components/Header';
import FilterSelection from '../../components/FilterSelection';
import Results from '../../components/Results';
import Filter from '../../components/Filter';
import Button from '../../components/Button';

import { FILTER_TYPES } from '../../constants/filter-types';

import { addFilter, updateFilter, removeFilter, loadFilters } from '../../concepts/filters';
import { getResults, getResultUrl, filterWords, clearResults } from '../../concepts/results';

import styles from './app.styl';

@CSSModules(styles)
class App extends Component {

  componentDidMount() {
    if (location.search) {
      this.props.loadFilters(location.search);
    }
  }

  clearResults() {
    const { results } = this.props;
    if (!results.isEmpty()) {
      this.props.clearResults();
    }
  }

  @autobind
  onAddFilter(type) {
    this.clearResults();
    this.props.addFilter(type);
  }

  @autobind
  onUpdateFilter(filter, opts) {
    this.clearResults();
    this.props.updateFilter(filter.get('id'), opts);
  }

  @autobind
  onRemoveFilter(filter) {
    this.clearResults();
    this.props.removeFilter(filter.get('id'));
  }

  @autobind
  onFilter() {
    this.clearResults();
    this.props.filterWords(this.props.selectedFilters);
  }

  render() {
    const { selectedFilters, results, url } = this.props;
    const showHelp = selectedFilters.isEmpty();
    const showSearch = !selectedFilters.isEmpty() && results.isEmpty();

    return (
      <div styleName="app-container">
        <Header />

        <div styleName="app-content">
          <FilterSelection
            filterTypes={FILTER_TYPES}
            selected={selectedFilters}
            onSelectFilter={this.onAddFilter}
          />

          {!selectedFilters.isEmpty() &&
          <h2>Hae kaikki sanat, jotka...</h2>
          }

          {selectedFilters.map((filter, key) =>
            <Filter
              key={key}
              filter={filter}
              onChange={this.onUpdateFilter}
              onRemove={this.onRemoveFilter}
            />
          )}

          <Results words={results} url={url} />

          {showHelp &&
          <div>
            <p>Aloita valitsemalla yksi tai useampi hakuehto.</p>
          </div>
          }

          {showSearch &&
          <div styleName="search">
            <Button type="primary" onClick={this.onFilter}>Hae sanoja</Button>
          </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  selectedFilters: state => state.get('filters'),
  results: getResults,
  url: getResultUrl
});;

const mapDispatchToProps = { addFilter, updateFilter, removeFilter, loadFilters, filterWords, clearResults };

export default connect(mapStateToProps, mapDispatchToProps)(App);

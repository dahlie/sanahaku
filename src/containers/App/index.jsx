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
import { isBusy, getResults, getResultUrl, filterWords, clearResults } from '../../concepts/words';

import styles from './app.styl';

class App extends Component {
  componentDidMount() {
    if (location.search) {
      this.props.loadFilters(location.search);
    }
  }

  clearResults() {
    const { results } = this.props;
    if (results && !results.isEmpty()) {
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
  onSearch() {
    this.clearResults();
    this.props.filterWords(this.props.selectedFilters);
  }

  @autobind
  onSave() {
    window.history.pushState('', '', `/?${this.props.url}`);
  }

  render() {
    const { selectedFilters, results, url, isBusy } = this.props;
    const showHelp = selectedFilters.isEmpty();
    const showSearch = !selectedFilters.isEmpty() && !results;

    return (
      <div styleName="app-container">
        <Header />

        <div styleName="app-wrapper">
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
                onSearch={this.onSearch}
                disabled={isBusy}
              />
            )}

            <Results
              words={results}
              currentUrl={location.search}
              resultsUrl={url}
              maxResults={500}
              onSave={this.onSave}
            />

            {showHelp &&
            <div>
              <p>Aloita valitsemalla yksi tai useampi hakuehto.</p>
            </div>
            }

            {showSearch &&
            <div styleName="search">
              <Button type="primary" onClick={this.onSearch}>{isBusy ? 'Etsitään sanoja...' : 'Hae sanoja'}</Button>
            </div>
            }

            <div styleName="copyright">
              &copy; 2016 Hannu Pousi - pousi@iki.fi
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  selectedFilters: state => state.get('filters'),
  results: getResults,
  url: getResultUrl,
  isBusy
});;

const mapDispatchToProps = { addFilter, updateFilter, removeFilter, loadFilters, filterWords, clearResults };

export default connect(mapStateToProps, mapDispatchToProps)(CSSModules(App, styles));

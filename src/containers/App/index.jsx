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

import { FILTER_TYPES } from '../../services/filters';

import { getFilters, addFilter, updateFilter, removeFilter, loadFilters } from '../../concepts/filters';
import { isBusy, getResults, getResultUrl, clearResults } from '../../concepts/words';
import { initialize, search } from '../../concepts/app';

import styles from './app.styl';

class App extends Component {
  componentDidMount() {
    this.props.initialize();
  }

  clearResults() {
    this.props.clearResults();
  }

  @autobind
  onAddFilter(type) {
    this.clearResults();
    this.props.addFilter(type);
  }

  @autobind
  onUpdateFilter(index, opts) {
    this.clearResults();
    this.props.updateFilter(index, opts);
  }

  @autobind
  onRemoveFilter(index) {
    this.clearResults();
    this.props.removeFilter(index);
  }

  @autobind
  onSearch() {
    this.clearResults();
    this.props.search(this.props.selectedFilters);
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
                index={key}
                filter={filter}
                onChange={this.onUpdateFilter}
                onRemove={this.onRemoveFilter}
                onSearch={this.onSearch}
                disabled={isBusy}
              />
            )}

            <Results words={results} resultsUrl={url} maxResults={500} />

            {showHelp &&
              <h2>Ohjeet</h2>
            }
            {showHelp &&
            <div styleName="help">
              <p>
                Sanahaku on palvelu, jonka avulla voit hakea suomenkielen sanoa erilaisten hakuehtojen perusteella.
                Sana-aineistona käytetään Kotimaisten kielten keskusksen julkaisemaa <a href="http://kaino.kotus.fi/sanat/nykysuomi/" target="_blank">nykysuomen sanalistaa</a>.
              </p>
              <p><strong>Aloita valitsemalla yksi tai useampi hakuehto.</strong></p>
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
  selectedFilters: getFilters,
  results: getResults,
  url: getResultUrl,
  isBusy
});;

const mapDispatchToProps = { initialize, search, addFilter, updateFilter, removeFilter, clearResults };

export default connect(mapStateToProps, mapDispatchToProps)(CSSModules(App, styles));

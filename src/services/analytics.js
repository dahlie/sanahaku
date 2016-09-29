import ReactGA from 'react-ga';
import queryString from 'query-string';

import { serialize } from './filters';

export const logQuery = (filters) => {
  const query = queryString.stringify(serialize(filters.toJS()));

  // Log queries only in production mode
  if (ENV !== 'development') {
    ReactGA.pageview(`/?${query}`);
  }
};

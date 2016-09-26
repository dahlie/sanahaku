import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './icon.styl';

const Icon = ({ type }) => (
  <div styleName="icon" className='fa fa-timesbefore' />
);

Icon.propTypes = {
  type: PropTypes.oneOf(['plus', 'cross'])
};

export default CSSModules(Icon, styles, { allowMultiple: true });

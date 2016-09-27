import { noop } from 'lodash/fp';
import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './button.styl';

const Button = ({ type, children, onClick }) => (
  <button styleName={`button ${type}`} onClick={onClick}>
    {children}
  </button>
);

Button.propTypes = {
  type: PropTypes.oneOf(['normal', 'primary']),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  type: 'normal',
  onClick: noop,
};

export default CSSModules(Button, styles, { allowMultiple: true });

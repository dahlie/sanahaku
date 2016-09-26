import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './button.styl';

const Button = ({ type, children, onClick }) => (
  <button styleName={`button ${type}`} onClick={onClick}>
    {children}
  </button>
);

Button.propTypes = {
  type: PropTypes.oneOf(['normal', 'primary'])
};

Button.defaultProps = {
  type: 'normal'
};

export default CSSModules(Button, styles, { allowMultiple: true });

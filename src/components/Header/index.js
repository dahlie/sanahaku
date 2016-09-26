import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './header.styl';

const Header = () => (
  <div styleName="container">
    <div styleName="content">
      <h1>sanahaku</h1>
    </div>
  </div>
);

export default CSSModules(Header, styles);

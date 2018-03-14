'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from '../../autokey';

class HGradient extends React.PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    hueBackground: PropTypes.string.isRequired
  };

  render() {
    const theme = autokey(themeable(this.props.theme));
    const { active, hueBackground } = this.props;
    if (!active) return <noscript />;
    return (
      <div>
        <div {...theme('gradient')} style={{ backgroundColor: hueBackground }} />
        <div {...theme('gradient', 'gradientHue')} />
      </div>
    );
  }
}

export default HGradient;

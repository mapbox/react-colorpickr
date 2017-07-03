'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';

class HGradient extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    hueBackground: PropTypes.string.isRequired
  };

  render() {
    const theme = themeable(this.props.theme);
    const { active, hueBackground } = this.props;
    if (!active) return <noscript />;
    return (
      <div>
        <div {...theme(1, 'gradient')} style={{ backgroundColor: hueBackground }} />
        <div {...theme(2, 'gradient', 'gradientLightLeft')} />
        <div {...theme(3, 'gradient', 'gradientDarkBottom')} />
      </div>
    );
  }
}

export default HGradient;

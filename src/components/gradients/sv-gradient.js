'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';

class SVGradient extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
    opacityLow: PropTypes.object.isRequired,
    opacityHigh: PropTypes.object.isRequired
  };

  render() {
    const theme = themeable(this.props.theme);
    const { active, color, opacityLow, opacityHigh } = this.props;
    if (!active) return <noscript />;
    return (
      <div>
        <div {...theme(1, 'gradient', `gradient${color.toUpperCase()}High`)} style={opacityHigh} />
        <div {...theme(2, 'gradient', `gradient${color.toUpperCase()}Low`)} style={opacityLow} />
        {color === 's' && <div {...theme(3, 'gradient', 'gradientDarkBottom')} />}
        {color === 'v' && <div {...theme(4, 'gradient', 'gradientLightBottom')} style={opacityHigh} />}
      </div>
    );
  }
}

export default SVGradient;

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';

class RGBGradient extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
    opacityLow: PropTypes.number.isRequired,
    opacityHigh: PropTypes.number.isRequired
  };

  render() {
    const theme = themeable(this.props.theme);
    const { active, color, opacityLow, opacityHigh } = this.props;
    if (!active) return <noscript />;
    return (
      <div>
        <div
          {...theme(1, 'gradient', `gradient${color.toUpperCase()}High`)}
          style={{ opacity: opacityHigh }}
        />
        <div
          {...theme(2, 'gradient', `gradient${color.toUpperCase()}Low`)}
          style={{ opacity: opacityLow }}
        />
      </div>
    );
  }
}

export default RGBGradient;

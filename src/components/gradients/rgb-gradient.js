import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from '../../autokey';

function RGBGradient({ theme, active, color, opacityLow, opacityHigh }) {
  const themer = autokey(themeable(theme));
  if (!active) return <noscript />;
  return (
    <>
      <div
        {...themer('gradient', `gradient${color.toUpperCase()}High`)}
        style={{ opacity: opacityHigh }}
      />
      <div
        {...themer('gradient', `gradient${color.toUpperCase()}Low`)}
        style={{ opacity: opacityLow }}
      />
    </>
  );
}

RGBGradient.PropTypes = {
  theme: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  opacityLow: PropTypes.number.isRequired,
  opacityHigh: PropTypes.number.isRequired
};

export { RGBGradient };

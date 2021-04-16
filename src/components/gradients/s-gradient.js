import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from '../../autokey';

function SGradient({ theme, active, opacityLow, opacityHigh }) {
  const themer = autokey(themeable(theme));
  if (!active) return <noscript />;
  return (
    <>
      <div
        {...themer('gradient', 'gradientSaturation')}
        style={{ opacity: opacityHigh }}
      />
      <div
        {...themer('gradient')}
        style={{
          background: 'linear-gradient(to bottom, rgb(255,255,255) 0%, rgba(128,128,128,0) 50%, rgb(0,0,0) 100%)',
          opacity: opacityHigh
        }}
      />
      <div
        {...themer('gradient')}
        style={{
          background: 'linear-gradient(to bottom, rgb(255,255,255) 0%, rgb(128,128,128) 50%, rgb(0,0,0) 100%)',
          opacity: opacityLow
        }}
      />
    </>
  );
}

SGradient.propTypes = {
  theme: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  opacityLow: PropTypes.number.isRequired,
  opacityHigh: PropTypes.number.isRequired
};

export { SGradient };

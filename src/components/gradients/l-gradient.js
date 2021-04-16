import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from '../../autokey';

function LGradient({ theme, active, opacityLow, opacityHigh }) {
  const themer = autokey(themeable(theme));
  if (!active) return <noscript />;

  // Opacity should be 0 when range value is at 0.5
  const high = (opacityHigh - 0.5) * 2;
  const low = (opacityLow - 0.5) * 2;

  return (
    <>
      <div {...themer('gradient', 'gradientLight')} />
      <div 
        {...themer('gradient')}
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgb(128,128,128) 100%)',
        }}
      />
      <div
        {...themer('gradient')}
        style={{
          background: 'rgb(255,255,255)',
          opacity: high
        }}
      />
      <div
        {...themer('gradient')}
        style={{
          background: 'rgb(0,0,0)',
          opacity: low
        }}
      />
    </>
  );
}

LGradient.PropTypes = {
  theme: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  opacityLow: PropTypes.number.isRequired,
  opacityHigh: PropTypes.number.isRequired
};

export { LGradient };

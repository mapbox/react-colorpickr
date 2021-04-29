import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from '../../autokey';

function HGradient({ theme, active, hueBackground }) {
  const themer = autokey(themeable(theme));
  if (!active) return <noscript />;
  return (
    <>
      <div {...themer('gradient')} style={{ backgroundColor: hueBackground }} />
      <div {...themer('gradient', 'gradientHue')} />
    </>
  );
}

HGradient.propTypes = {
  theme: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  hueBackground: PropTypes.string.isRequired
};

export { HGradient };

'use strict';

import SVGradient from '../../src/components/gradients/sv-gradient';

export const basic = {
  description: 'basic',
  component: SVGradient,
  props: {
    active: false,
    color: 'r',
    theme: {},
    opacityLow: {},
    opacityHigh: {}
  }
};

export const opacity = {
  description: 'opacity',
  component: SVGradient,
  props: {
    active: false,
    color: 'r',
    theme: {},
    opacityLow: { opacity: .5 },
    opacityHigh: { opacity: .6 }
  }
};

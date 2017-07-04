'use strict';

import RGBGradient from '../../src/components/gradients/rgb-gradient';

export const basic = {
  description: 'basic',
  component: RGBGradient,
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
  component: RGBGradient,
  props: {
    active: false,
    color: 'r',
    theme: {},
    opacityLow: { opacity: .5 },
    opacityHigh: { opacity: .6 }
  }
};

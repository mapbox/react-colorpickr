'use strict';

import LGradient from '../../src/components/gradients/l-gradient';

export const basic = {
  description: 'basic',
  component: LGradient,
  props: {
    active: true,
    theme: {},
    opacityLow: 0,
    opacityHigh: 0
  }
};

export const opacity = {
  description: 'opacity',
  component: LGradient,
  props: {
    active: false,
    theme: {},
    opacityLow: .5,
    opacityHigh: .6
  }
};

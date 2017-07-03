'use strict';

import HGradient from '../../src/components/gradients/h-gradient';

export const inactive = {
  description: 'inactive',
  component: HGradient,
  props: {
    active: false,
    theme: {},
    hueBackground: 'blue'
  }
};

export const active = {
  description: 'inactive',
  component: HGradient,
  props: {
    active: true,
    theme: {},
    hueBackground: 'blue'
  }
};

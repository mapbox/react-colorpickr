import { SGradient } from '../../src/components/gradients/s-gradient';

export const basic = {
  description: 'basic',
  component: SGradient,
  props: {
    active: true,
    theme: {},
    opacityLow: 0,
    opacityHigh: 0
  }
};

export const opacity = {
  description: 'opacity',
  component: SGradient,
  props: {
    active: false,
    theme: {},
    opacityLow: .5,
    opacityHigh: .6
  }
};

import { RGBGradient } from '../../src/components/gradients/rgb-gradient';

export const basic = {
  description: 'basic',
  component: RGBGradient,
  props: {
    active: true,
    color: 'r',
    theme: {},
    opacityLow: 0,
    opacityHigh: 0
  }
};

export const opacity = {
  description: 'opacity',
  component: RGBGradient,
  props: {
    active: false,
    color: 'r',
    theme: {},
    opacityLow: .5,
    opacityHigh: .6
  }
};

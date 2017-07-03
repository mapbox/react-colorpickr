'use strict';

import ColorPickr from '../../src/colorpickr';
import { safeSpy } from '../test-util/safe-spy';

export const basic = {
  description: 'basic',
  component: ColorPickr,
  props: {
    onChange: safeSpy()
  }
};

export const rgbValue = {
  description: 'rgbValue',
  component: ColorPickr,
  props: {
    value: 'rgba(0,255,255,0.5)',
    onChange: safeSpy()
  }
};

export const hslaValue = {
  description: 'rgbValue',
  component: ColorPickr,
  props: {
    value: 'hsla(180, 100%, 50%, 0.5)',
    onChange: safeSpy()
  }
};

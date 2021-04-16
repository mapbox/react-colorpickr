import ColorPickr from '../../src/colorpickr';
import { safeSpy } from '../test-util/safe-spy';

export const basic = {
  description: 'basic',
  component: ColorPickr,
  props: {
    onChange: safeSpy()
  }
};

export const readOnly = {
  description: 'read only',
  component: ColorPickr,
  props: {
    onChange: safeSpy(),
    readOnly: true
  }
};

export const hexValue = {
  description: 'hex value',
  component: ColorPickr,
  props: {
    initialValue: '#33ffee',
    onChange: safeSpy()
  }
};

export const shortHexValue = {
  description: 'show hex value',
  component: ColorPickr,
  props: {
    initialValue: '#3fe',
    onChange: safeSpy()
  }
};

export const rgbValue = {
  description: 'rgb value',
  component: ColorPickr,
  props: {
    initialValue: 'rgba(0, 255, 255, 0.5)',
    onChange: safeSpy()
  }
};

export const hslValue = {
  description: 'hsl value',
  component: ColorPickr,
  props: {
    initialValue: 'hsl(72, 10%, 90%)',
    onChange: safeSpy()
  }
};

export const hslaValue = {
  description: 'hsla value',
  component: ColorPickr,
  props: {
    initialValue: 'hsla(180, 100%, 50%, 0.5)',
    onChange: safeSpy()
  }
};

export const allOptions = {
  description: 'all options',
  component: ColorPickr,
  props: {
    initialValue: 'hsla(18, 10%, 30%, 0.25)',
    mode: 'rgb',
    channel: 'g',
    reset: false,
    onChange: safeSpy()
  }
};

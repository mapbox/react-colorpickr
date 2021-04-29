import React from 'react';
import { render } from '@testing-library/react';
import { RGBGradient } from './rgb-gradient';

describe('RGBGradient', () => {
  test('renders', () => {
    const props = {
      active: true,
      color: 'r',
      theme: {},
      opacityLow: 0,
      opacityHigh: 0
    };

    const { baseElement } = render(<RGBGradient {...props} />);
    expect(baseElement).toMatchSnapshot();
  });

  test('renders with opacity', () => {
    const props = {
      active: false,
      color: 'r',
      theme: {},
      opacityLow: 0.5,
      opacityHigh: 0.6
    };

    const { baseElement } = render(<RGBGradient {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

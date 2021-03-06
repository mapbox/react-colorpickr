import React from 'react';
import { render } from '@testing-library/react';
import { SGradient } from './s-gradient';

describe('SGradient', () => {
  test('renders', () => {
    const props = {
      active: true,
      theme: {},
      opacityLow: 0,
      opacityHigh: 0
    };

    const { baseElement } = render(<SGradient {...props} />);
    expect(baseElement).toMatchSnapshot();
  });

  test('renders with opacity', () => {
    const props = {
      active: false,
      theme: {},
      opacityLow: 0.5,
      opacityHigh: 0.6
    };

    const { baseElement } = render(<SGradient {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

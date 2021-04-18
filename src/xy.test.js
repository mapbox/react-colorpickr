import React from 'react';
import { render } from '@testing-library/react';
import { XYControl } from './xy';

describe('XYControl', () => {
  test('renders', () => {
    const props = {
      theme: {},
      x: 0,
      y: 10,
      xmax: 100,
      ymax: 100,
      isDark: false,
      onChange: jest.fn()
    };

    const { baseElement } = render(
      <XYControl {...props}>
        <span>children</span>
      </XYControl>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test('renders isDark', () => {
    const props = {
      theme: {},
      x: 0,
      y: 10,
      xmax: 100,
      ymax: 100,
      isDark: true,
      onChange: jest.fn()
    };

    const { baseElement } = render(
      <XYControl {...props}>
        <span>children</span>
      </XYControl>
    );
    expect(baseElement).toMatchSnapshot();
  });
});

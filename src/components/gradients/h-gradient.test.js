import React from 'react';
import { render } from '@testing-library/react';
import { HGradient } from './h-gradient';

describe('HGradient', () => {
  test('renders inactive', () => {
    const props = {
      active: false,
      theme: {},
      hueBackground: 'blue'
    };

    const { baseElement } = render(<HGradient {...props} />);
    expect(baseElement).toMatchSnapshot();
  });

  test('renders active', () => {
    const props = {
      active: true,
      theme: {},
      hueBackground: 'blue'
    };

    const { baseElement } = render(<HGradient {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

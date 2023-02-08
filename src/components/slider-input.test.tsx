import React from 'react';
import { render, screen } from '@testing-library/react';
import { SliderInput } from './slider-input';

describe('SliderInput', () => {
  const props = {
    onChange: jest.fn(),
    colorValue: 'red',
    trackStyle: { backgroundColor: 'green' },
    id: 'hue',
    value: 50,
    min: 0,
    max: 360,
    disabled: false
  };

  test('renders', () => {
    const { baseElement } = render(<SliderInput {...props} />);
    expect(baseElement).toMatchSnapshot();
  });

  test('disabled', () => {
    render(<SliderInput {...props} disabled={true} />);
    expect(
      screen.getByTestId('hue-slider').getAttribute('data-disabled')
    ).not.toEqual(null);
  });
});

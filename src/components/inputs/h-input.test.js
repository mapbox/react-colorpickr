import React from 'react';
import { render } from '@testing-library/react';
import { HInput } from './h-input';

describe('HInput', () => {
  test('renders', () => {
    const props = {
      id: 'h',
      value: 200,
      theme: {},
      onChange: jest.fn()
    };

    const { baseElement } = render(<HInput {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

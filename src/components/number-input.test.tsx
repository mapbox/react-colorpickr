import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from './number-input';
import userEvent from '@testing-library/user-event';

describe('NumberInput', () => {
  const user = userEvent.setup();
  let wrapper;
  const props = {
    id: 'label',
    theme: {},
    onChange: jest.fn(),
    min: 1,
    max: 100,
    value: 10
  };

  beforeEach(() => {
    wrapper = render(<NumberInput {...props} />);
  });

  test('renders', () => {
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test('onChange', async () => {
    const mockEvent = {
      target: {
        value: '12'
      }
    };
    const input = screen.getByTestId('label-input');
    await user.click(input);
    fireEvent.change(input, mockEvent);
    expect(props.onChange).toHaveBeenCalledWith(12);
  });

  test('max caps off the value', async () => {
    const mockEvent = {
      target: {
        value: '120'
      }
    };
    const input = screen.getByTestId('label-input');
    await user.click(input);
    fireEvent.change(input, mockEvent);
    expect(props.onChange).toHaveBeenCalledWith(100);
  });

  test('leading zero is chopped off', async () => {
    const mockEvent = {
      target: {
        value: '012'
      }
    };
    const input = screen.getByTestId('label-input');
    user.click(input);
    fireEvent.change(input, mockEvent);
    expect(props.onChange).toHaveBeenCalledWith(12);
  });
});

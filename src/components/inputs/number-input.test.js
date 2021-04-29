import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from './number-input';
import userEvent from '@testing-library/user-event';

describe('NumberInput', () => {
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

  test('onChange', () => {
    const mockEvent = {
      target: {
        value: '12'
      }
    };
    const input = screen.getByLabelText('label');
    userEvent.click(input);
    fireEvent.change(input, mockEvent);
    expect(props.onChange).toHaveBeenCalledWith('label', 12);
  });

  test('max caps off the value', () => {
    const mockEvent = {
      target: {
        value: '120'
      }
    };
    const input = screen.getByLabelText('label');
    userEvent.click(input);
    fireEvent.change(input, mockEvent);
    expect(props.onChange).toHaveBeenCalledWith('label', 100);
  });

  test('leading zero is chopped off', () => {
    const mockEvent = {
      target: {
        value: '012'
      }
    };
    const input = screen.getByLabelText('label');
    userEvent.click(input);
    fireEvent.change(input, mockEvent);
    expect(props.onChange).toHaveBeenCalledWith('label', 12);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModeInput } from './mode-input';
import userEvent from '@testing-library/user-event';

describe('ModeInput', () => {
  const user = userEvent.setup();
  const props = {
    id: 'mode',
    checked: false,
    theme: {},
    name: 'mode',
    onChange: jest.fn()
  };

  test('renders', () => {
    const { baseElement } = render(<ModeInput {...props} />);
    expect(baseElement).toMatchSnapshot();
  });

  test('onChange', async () => {
    render(<ModeInput {...props} />);
    await user.click(screen.getByRole('radio'));
    expect(props.onChange).toHaveBeenCalled();
  });
});

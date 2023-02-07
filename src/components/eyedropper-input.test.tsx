import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EyedropperInput } from './eyedropper-input';

describe('EyedropperInput', () => {
  const user = userEvent.setup();

  const props = {
    theme: {},
    onChange: jest.fn()
  };

  test('renders', () => {
    const { baseElement } = render(<EyedropperInput {...props} />);
    expect(baseElement).toMatchSnapshot();
  });

  test('disabled', async () => {
    render(<EyedropperInput {...props} disabled={true} />);
    await user.click(screen.getByTestId('eye-dropper'));
    await waitFor(() => {
      expect(props.onChange).not.toHaveBeenCalled();
    });
  });

  test('activates element', async () => {
    render(<EyedropperInput {...props} />);
    await user.click(screen.getByTestId('eye-dropper'));
    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith('rgba(255, 255, 255, 0)');
    });
  });
});

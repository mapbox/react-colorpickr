import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorPickr from './colorpickr';
import '@testing-library/jest-dom/extend-expect';

describe('Colorpickr', () => {
  const user = userEvent.setup();

  describe('renders', () => {
    let wrapper;
    const props = {
      onChange: jest.fn()
    };

    beforeEach(() => {
      wrapper = render(<ColorPickr {...props} />);
    });

    test('renders', () => {
      expect(wrapper.baseElement).toMatchSnapshot();
    });

    test('hex input returns value onChange', () => {
      const mockEvent = {
        target: {
          value: 'eeef'
        }
      };

      const input = screen.getByTestId('color-input');
      fireEvent.change(input, mockEvent);
      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toHaveBeenCalledWith({
        h: 0,
        s: 0,
        l: 93,
        r: 238,
        g: 238,
        b: 238,
        a: 1,
        hexInput: true,
        hex: 'eeef',
        mode: 'disc'
      });
    });

    test('invalid hex input does not fire onChange', () => {
      const mockEvent = {
        target: {
          value: 'eeeff'
        }
      };

      const input = screen.getByTestId('color-input');
      fireEvent.change(input, mockEvent);
      expect(props.onChange).toHaveBeenCalledTimes(0);
    });

    test('leading hash is permitted', () => {
      const mockEvent = {
        target: {
          value: '#333'
        }
      };

      const input = screen.getByTestId('color-input');
      fireEvent.change(input, mockEvent);
      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toHaveBeenCalledWith({
        h: 0,
        s: 0,
        l: 20,
        r: 51,
        g: 51,
        b: 51,
        a: 1,
        hexInput: true,
        hex: '333',
        mode: 'disc'
      });
    });

    test('hex input adjusts value onBlur', () => {
      const mockEvent = {
        target: {
          value: 'eeef'
        }
      };

      const input = screen.getByTestId('color-input');
      fireEvent.blur(input, mockEvent);
      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toHaveBeenCalledWith({
        h: 0,
        s: 0,
        l: 93,
        r: 238,
        g: 238,
        b: 238,
        a: 1,
        hexInput: true,
        hex: 'eeeeee',
        mode: 'disc'
      });
    });

    test('default mode is active', () => {
      const element = screen.getByTestId('mode-disc');
      expect(element.classList.contains('is-active')).toEqual(true);
    });

    test('default reset action is present', () => {
      const element = screen.getByTestId('color-reset');
      expect(element).toBeTruthy();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('overrides', () => {
    let mockedInstance;

    const props = {
      onChange: jest.fn(),
      mounted: (instance) => (mockedInstance = instance)
    };

    beforeEach(() => {
      render(<ColorPickr {...props} />);
    });

    test('mocked instance is called', () => {
      mockedInstance.overrideValue('red');
      expect(props.onChange).toHaveBeenCalledWith({
        h: 0,
        s: 100,
        l: 50,
        r: 255,
        g: 0,
        b: 0,
        a: 1,
        hexInput: false,
        hex: 'ff0000',
        mode: 'disc'
      });

      const element = screen.getByTestId('color-reset');
      expect(element.style.backgroundColor).toEqual('rgb(0, 0, 0)');
    });

    test('overrideValue with true as second argument sets overrides initialValue', () => {
      mockedInstance.overrideValue('red', true);
      expect(props.onChange).toHaveBeenCalledWith({
        h: 0,
        s: 100,
        l: 50,
        r: 255,
        g: 0,
        b: 0,
        a: 1,
        hexInput: false,
        hex: 'ff0000',
        mode: 'disc'
      });

      const element = screen.getByTestId('color-reset');
      expect(element.style.backgroundColor).toEqual('rgb(255, 0, 0)');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('readOnly', () => {
    const props = {
      onChange: jest.fn(),
      readOnly: true
    };

    test('renders', async () => {
      const { baseElement } = render(<ColorPickr {...props} />);
      expect(baseElement).toMatchSnapshot();
      expect(screen.getByTestId('color-input')).toHaveAttribute('readonly');
      expect(screen.getByTestId('color-reset')).toHaveAttribute('disabled');
      expect(screen.getByTestId('hue-slider')).toHaveAttribute('data-disabled');
      expect(screen.getByTestId('alpha-slider')).toHaveAttribute(
        'data-disabled'
      );

      const input = screen.getByTestId('mode-values');
      await user.click(input);

      expect(screen.getByTestId('h-input')).toHaveAttribute('readonly');
      expect(screen.getByTestId('s-input')).toHaveAttribute('readonly');
      expect(screen.getByTestId('l-input')).toHaveAttribute('readonly');
      expect(screen.getByTestId('r-input')).toHaveAttribute('readonly');
      expect(screen.getByTestId('g-input')).toHaveAttribute('readonly');
      expect(screen.getByTestId('b-input')).toHaveAttribute('readonly');
      expect(screen.getByTestId('a-input')).toHaveAttribute('readonly');
    });
  });

  describe('reset', () => {
    const props = {
      onChange: jest.fn(),
      reset: false
    };

    test('renders', () => {
      const { queryByTestId } = render(<ColorPickr {...props} />);
      expect(queryByTestId('color-reset')).toBeFalsy();
    });
  });

  describe('reset', () => {
    const props = {
      onChange: jest.fn(),
      alpha: false
    };

    test('renders', () => {
      const { queryByLabelText, queryByTestId } = render(
        <ColorPickr {...props} />
      );
      expect(queryByLabelText('α')).toBeFalsy();
      expect(queryByTestId('alpha-slider')).toBeFalsy();
    });
  });

  describe('hex value', () => {
    test('hex value remains long', () => {
      const props = {
        initialValue: '#33ffee',
        onChange: jest.fn()
      };

      render(<ColorPickr {...props} />);
      const element = screen.getByTestId('color-input') as HTMLInputElement;
      expect(element.value).toEqual('#33ffee');
    });

    test('hex value remains short', () => {
      const props = {
        initialValue: '#3fe',
        onChange: jest.fn()
      };

      render(<ColorPickr {...props} />);
      const element = screen.getByTestId('color-input') as HTMLInputElement;
      expect(element.value).toEqual('#3fe');
    });

    test('hex value maintains alpha onChange', () => {
      const props = {
        initialValue: 'hsla(100, 50%, 40%, 0.5)',
        onChange: jest.fn()
      };

      render(<ColorPickr {...props} />);
      const mockEvent = {
        target: {
          value: '#333'
        }
      };

      const input = screen.getByTestId('color-input');
      fireEvent.change(input, mockEvent);
      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toHaveBeenCalledWith({
        h: 0,
        s: 0,
        l: 20,
        r: 51,
        g: 51,
        b: 51,
        a: 0.5,
        hexInput: true,
        hex: '333',
        mode: 'disc'
      });
    });
  });

  describe('modes', () => {
    test('disc', async () => {
      const props = {
        initialValue: 'rgba(0, 255, 255, 0.5)',
        onChange: jest.fn()
      };

      render(<ColorPickr {...props} />);
      const input = screen.getByTestId('mode-values');

      await user.click(input);
      expect(props.onChange).toHaveBeenCalledWith({
        h: 180,
        s: 100,
        l: 50,
        r: 0,
        g: 255,
        b: 255,
        a: 0.5,
        hexInput: false,
        hex: '00ffff',
        mode: 'values'
      });
    });

    test('values', async () => {
      const props = {
        initialValue: 'hsla(180, 100%, 50%, 0.5)',
        mode: 'values',
        onChange: jest.fn()
      } as const;

      render(<ColorPickr {...props} />);
      const input = screen.getByTestId('mode-disc');

      await user.click(input);
      expect(props.onChange).toHaveBeenCalledWith({
        h: 180,
        s: 100,
        l: 50,
        r: 0,
        g: 255,
        b: 255,
        a: 0.5,
        hexInput: false,
        hex: '00ffff',
        mode: 'disc'
      });
    });
  });
});

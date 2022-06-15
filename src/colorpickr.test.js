import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorPickr from './colorpickr';
import '@testing-library/jest-dom/extend-expect';

describe('Colorpickr', () => {
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

      const input = wrapper.getByTestId('hex-input');
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
        mode: 'hsl',
        channel: 'h'
      });
    });

    test('invalid hex input does not fire onChange', () => {
      const mockEvent = {
        target: {
          value: 'eeeff'
        }
      };

      const input = wrapper.getByTestId('hex-input');
      fireEvent.change(input, mockEvent);
      expect(props.onChange).toHaveBeenCalledTimes(0);
    });

    test('leading hash is permitted', () => {
      const mockEvent = {
        target: {
          value: '#333'
        }
      };

      const input = wrapper.getByTestId('hex-input');
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
        mode: 'hsl',
        channel: 'h'
      });
    });

    test('hex input adjusts value onBlur', () => {
      const mockEvent = {
        target: {
          value: 'eeef'
        }
      };

      const input = wrapper.getByTestId('hex-input');
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
        mode: 'hsl',
        channel: 'h'
      });
    });

    test('default mode is active', () => {
      const element = wrapper.getByTestId('mode-hsl');
      expect(element.checked).toEqual(true);
    });

    test('default reset action is present', () => {
      const element = wrapper.getByTestId('color-reset');
      expect(element).toBeTruthy();
    });

    test('hex input retains alpha value onChange', () => {
      props.initialValue = 'hsla(0, 0%, 20%, 0.5)';

      const mockEvent = {
        target: {
          value: '#333'
        }
      };

      const input = wrapper.getByTestId('hex-input');
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
        mode: 'hsl',
        channel: 'h'
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('overrides', () => {
    let wrapper;
    let mockedInstance;

    const props = {
      onChange: jest.fn(),
      mounted: (instance) => (mockedInstance = instance)
    };

    beforeEach(() => {
      wrapper = render(<ColorPickr {...props} />);
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
        mode: 'hsl',
        channel: 'h'
      });

      const element = wrapper.getByTestId('color-reset');
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
        mode: 'hsl',
        channel: 'h'
      });

      const element = wrapper.getByTestId('color-reset');
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

    test('renders', () => {
      const { baseElement, getByTestId, getByLabelText } = render(
        <ColorPickr {...props} />
      );
      expect(baseElement).toMatchSnapshot();
      expect(getByTestId('hex-input')).toHaveAttribute('readonly');
      expect(getByTestId('color-reset')).toHaveAttribute('disabled');
      expect(getByTestId('color-slider')).toHaveAttribute('disabled');
      expect(getByTestId('alpha-slider')).toHaveAttribute('disabled');
      expect(getByLabelText('α')).toHaveAttribute('readonly');
      expect(getByLabelText('h')).toHaveAttribute('readonly');
      expect(getByLabelText('s')).toHaveAttribute('readonly');
      expect(getByLabelText('l')).toHaveAttribute('readonly');
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

      const { getByTestId } = render(<ColorPickr {...props} />);
      const element = getByTestId('hex-input');
      expect(element.value).toEqual('33ffee');
    });

    test('hex value remains short', () => {
      const props = {
        initialValue: '#3fe',
        onChange: jest.fn()
      };

      const { getByTestId } = render(<ColorPickr {...props} />);
      const element = getByTestId('hex-input');
      expect(element.value).toEqual('3fe');
    });
  });

  describe('modes', () => {
    test('rgb', () => {
      const props = {
        initialValue: 'rgba(0, 255, 255, 0.5)',
        onChange: jest.fn()
      };

      const { getByTestId } = render(<ColorPickr {...props} />);
      const input = getByTestId('mode-rgb');

      const mockEvent = {
        target: {
          value: 'rgb'
        }
      };

      userEvent.click(input);
      fireEvent.change(input, mockEvent);
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
        mode: 'rgb',
        channel: 'h'
      });
    });

    test('hsl', () => {
      const props = {
        initialValue: 'hsla(180, 100%, 50%, 0.5)',
        mode: 'rgb',
        onChange: jest.fn()
      };

      const { getByTestId } = render(<ColorPickr {...props} />);
      const input = getByTestId('mode-hsl');

      const mockEvent = {
        target: {
          value: 'hsl'
        }
      };

      userEvent.click(input);
      fireEvent.change(input, mockEvent);
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
        mode: 'hsl',
        channel: 'h'
      });
    });
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as testCases from '../test-cases/colorpickr-test-cases';

describe('Colorpickr', () => {
  let testCase;
  let wrapper;

  describe(testCases.basic.description, () => {
    beforeEach(() => {
      testCase = testCases.basic;
      wrapper = shallow(React.createElement(testCase.component, testCase.props));
    });

    test('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('hex input returns value onChange', () => {
      const mockEvent = {
        target: {
          value: 'eeef'
        }
      };

      wrapper.find('[data-test="hex-input"]').props().onChange(mockEvent);
      expect(toJson(wrapper)).toMatchSnapshot();
      expect(testCase.props.onChange).toHaveBeenCalledTimes(1);
      expect(testCase.props.onChange).toHaveBeenCalledWith({
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

      wrapper.find('[data-test="hex-input"]').props().onChange(mockEvent);
      expect(toJson(wrapper)).toMatchSnapshot();
      expect(testCase.props.onChange).toHaveBeenCalledTimes(0);
    });

    test('hex input adjusts value onBlur', () => {
      const mockEvent = {
        target: {
          value: 'eeef'
        }
      };

      wrapper.find('[data-test="hex-input"]').props().onBlur(mockEvent);
      expect(toJson(wrapper)).toMatchSnapshot();
      expect(testCase.props.onChange).toHaveBeenCalledTimes(1);
      expect(testCase.props.onChange).toHaveBeenCalledWith({
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
      const checked = wrapper.find('[data-test="mode-hsl"]').props().checked;
      expect(checked).toEqual(true);
    });

    test('default reset action is present', () => {
      const reset = wrapper.find('[data-test="color-reset"]').exists();
      expect(reset).toBe(true);
    });

    test('overrideValue manually sets a new color', () => {
      wrapper.instance().overrideValue('red');
      expect(testCase.props.onChange).toHaveBeenCalledTimes(1);
      expect(testCase.props.onChange).toHaveBeenCalledWith({
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
      expect(wrapper.instance().state.initialValue).toEqual('#000');
    });

    test('overrideValue with true as second argument sets overrides initialValue', () => {
      wrapper.instance().overrideValue('red', true);
      expect(testCase.props.onChange).toHaveBeenCalledTimes(1);
      expect(testCase.props.onChange).toHaveBeenCalledWith({
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
      expect(wrapper.instance().state.initialValue).toEqual('red');
    });
  });

  describe(testCases.readOnly.description, () => {
    beforeEach(() => {
      testCase = testCases.readOnly;
      wrapper = shallow(React.createElement(testCase.component, testCase.props));
    });

    test('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe(testCases.hexValue.description, () => {
    beforeEach(() => {
      testCase = testCases.hexValue;
      wrapper = shallow(React.createElement(testCase.component, testCase.props));
    });

    test('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('hex value remains long', () => {
      const value = wrapper.find('[data-test="hex-input"]').props().value;
      expect(value).toEqual('33ffee');
    });
  });

  describe(testCases.shortHexValue.description, () => {
    beforeEach(() => {
      testCase = testCases.shortHexValue;
      wrapper = shallow(React.createElement(testCase.component, testCase.props));
    });

    test('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('hex value remains short', () => {
      const value = wrapper.find('[data-test="hex-input"]').props().value;
      expect(value).toEqual('3fe');
    });
  });

  describe(testCases.rgbValue.description, () => {
    beforeEach(() => {
      testCase = testCases.rgbValue;
      wrapper = shallow(React.createElement(testCase.component, testCase.props));
    });

    test('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('onChange with correct values', () => {
      const mockEvent = {
        target: {
          value: 'rgb'
        }
      };
      wrapper.find('[data-test="mode-rgb"]').props().onChange(mockEvent);
      wrapper.update();
      expect(testCase.props.onChange).toHaveBeenCalledTimes(1);
      expect(testCase.props.onChange).toHaveBeenCalledWith({
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
  });

  describe(testCases.hslValue.description, () => {
    beforeEach(() => {
      testCase = testCases.hslValue;
      wrapper = shallow(React.createElement(testCase.component, testCase.props));
    });

    test('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe(testCases.hslaValue.description, () => {
    beforeEach(() => {
      testCase = testCases.hslaValue;
      wrapper = shallow(React.createElement(testCase.component, testCase.props));
    });

    test('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('onChange with correct values', () => {
      const mockEvent = {
        target: {
          value: 'hsl'
        }
      };
      wrapper.find('[data-test="mode-hsl"]').props().onChange(mockEvent);
      wrapper.update();
      expect(testCase.props.onChange).toHaveBeenCalledTimes(1);
      expect(testCase.props.onChange).toHaveBeenCalledWith({
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

  describe(testCases.allOptions.description, () => {
    beforeEach(() => {
      testCase = testCases.allOptions;
      wrapper = shallow(React.createElement(testCase.component, testCase.props));
    });

    test('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('correct mode is active', () => {
      const checked = wrapper.find('[data-test="mode-rgb"]').props().checked;
      expect(checked).toEqual(true);
    });

    test('reset action is not present', () => {
      const reset = wrapper.find('[data-test="color-reset"]').exists();
      expect(reset).toBe(false);
    });
  });
});

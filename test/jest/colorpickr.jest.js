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
        v: 100,
        r: 0,
        g: 255,
        b: 255,
        a: 0.5,
        hex: '0ff',
        mode: 'rgb',
        colorAttribute: 'h'
      });
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
          value: 'hsv'
        }
      };
      wrapper.find('[data-test="mode-hsv"]').props().onChange(mockEvent);
      wrapper.update();
      expect(testCase.props.onChange).toHaveBeenCalledTimes(1);
      expect(testCase.props.onChange).toHaveBeenCalledWith({
        h: 180,
        s: 100,
        v: 100,
        r: 0,
        g: 255,
        b: 255,
        a: 0.5,
        hex: '0ff',
        mode: 'hsv',
        colorAttribute: 'h'
      });
    });
  });
});

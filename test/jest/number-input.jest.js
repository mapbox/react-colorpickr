import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as testCases from '../test-cases/number-input-test-cases';

describe('NumberInput', () => {
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

    test('onChange works', () => {
      const mockEvent = {
        target: {
          value: '12'
        }
      };
      wrapper.find('input').prop('onChange')(mockEvent);
      expect(testCase.props.onChange).toHaveBeenCalledWith(
        'label',
        12
      );
    });

    test('max truncates onChange value', () => {
      const mockEvent = {
        target: {
          value: '120'
        }
      };
      wrapper.find('input').prop('onChange')(mockEvent);
      expect(testCase.props.onChange).toHaveBeenCalledWith(
        'label',
        100
      );
    });
  });
});

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
      const mockEvent = {};
      wrapper.find('input').prop('onChange')(mockEvent);
      expect(testCase.props.onChange).toHaveBeenCalledWith(
        'label',
        mockEvent
      );
    });
  });
});

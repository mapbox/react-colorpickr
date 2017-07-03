import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as testCases from '../test-cases/h-gradient-test-cases';

describe('HInput', () => {
  let testCase;
  let wrapper;

  describe(testCases.inactive.description, () => {
    beforeEach(() => {
      testCase = testCases.inactive;
      wrapper = shallow(React.createElement(testCase.component, testCase.props));
    });

    test('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe(testCases.active.description, () => {
    beforeEach(() => {
      testCase = testCases.active;
      wrapper = shallow(React.createElement(testCase.component, testCase.props));
    });

    test('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});

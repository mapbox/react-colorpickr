'use strict';

var jsdom = require('jsdom');
global.document = jsdom.jsdom('');
global.window = document.defaultView;
global.navigator = window.navigator;
var React = require('react');
var ModeInput = require('../../../src/components/inputs/mode-input');
var mount = require('enzyme').mount;
var expect = require('expect');
var sinon = require('sinon');

describe('mode input component basics', (t) => {
  var onChange = () => {};
  it('should render radio input with correct value', function() {
    const wrapper = mount(<ModeInput checked={true} onChange={onChange} />);
    const correctInput = wrapper.contains(
      <div>
        <input
          type='radio'
          name='mode'
          checked={true}
          onChange={onChange}
        />
      </div>
    );
    expect(correctInput).toBe(true);
  });
});

'use strict';

var jsdom = require('jsdom');
global.document = jsdom.jsdom('');
global.window = document.defaultView;
global.navigator = window.navigator;
var React = require('react');
var SVAlphaInput = require('../../../src/components/inputs/sv-alpha-input');
var mount = require('enzyme').mount;
var expect = require('expect');
var sinon = require('sinon');

describe('sv-alpha input component basics', (t) => {
  var onChange = () => {};
  it('should render number input with correct value', function() {
    const wrapper = mount(<SVAlphaInput label='S' value={92} onChange={onChange} />);
    const correctInput = wrapper.contains(
      <div>
       <label>S</label>
        <input
          value={92}
          onChange={onChange}
          type='number'
          min={0}
          max={100}
          step={1} 
        />
      </div>
    );
    expect(correctInput).toBe(true);
  });
});

'use strict';

var jsdom = require('jsdom');
global.document = jsdom.jsdom('');
global.window = document.defaultView;
global.navigator = window.navigator;
var React = require('react');
var HInput = require('../../../src/components/inputs/h-input');
var mount = require('enzyme').mount;
var expect = require('expect');
var sinon = require('sinon');

describe('h input component basics', (t) => {
  var onChange = () => {};
  it('should render number input with correct value', function() {
    const wrapper = mount(<HInput label='H' value={200} onChange={onChange} />);
    const correctInput = wrapper.contains(
      <div>
       <label>H</label>
        <input
          value={200}
          onChange={onChange}
          type='number'
          min={0}
          max={359}
          step={1} 
        />
      </div>
    );
    expect(correctInput).toBe(true);
  });
});

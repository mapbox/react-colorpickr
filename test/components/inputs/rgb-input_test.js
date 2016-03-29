'use strict';

var jsdom = require('jsdom');
global.document = jsdom.jsdom('');
global.window = document.defaultView;
global.navigator = window.navigator;
var React = require('react');
var RGBInput = require('../../../src/components/inputs/rgb-input');
var mount = require('enzyme').mount;
var expect = require('expect');
var sinon = require('sinon');

describe('rgb input component basics', (t) => {
  var onChange = () => {};
  it('should render number input with correct value', function() {
    const wrapper = mount(<RGBInput label='R' value={200} onChange={onChange} />);
    const correctInput = wrapper.contains(
      <div>
       <label>R</label>
        <input
          value={200}
          onChange={onChange}
          type='number'
          min={0}
          max={255}
          step={1} 
        />
      </div>
    );
    expect(correctInput).toBe(true);
  });
});

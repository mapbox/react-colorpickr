'use strict';

var jsdom = require('jsdom');
global.document = jsdom.jsdom('');
global.window = document.defaultView;
global.navigator = window.navigator;
var React = require('react');
var ColorPicker = require('../src/colorpickr');
var mount = require('enzyme').mount;
var expect = require('expect');
var sinon = require('sinon');

describe('component basics', (t) => {
  var changeSpy = sinon.spy();
  const wrapper = mount(<ColorPicker onChange={changeSpy} />);
  it('starts with the default value', function() {
    expect(wrapper.find('.cp-hex-input').props().value).toEqual('3887be', 'default HEX value is present');
  });
});

describe('rgba value', (t) => {
  var changeSpy = sinon.spy();
  const wrapper = mount(<ColorPicker
    value='rgba(0,255,255,0.5)'
    onChange={changeSpy} />);

  it('emits a change object with values', function() {
    wrapper.find('.cp-mode-hsv').simulate('click');
    expect(changeSpy.getCall(0).args[0]).toEqual({
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

describe('hsla value', (t) => {
  var changeSpy = sinon.spy();
  const wrapper = mount(<ColorPicker
    value='hsla(180, 100%, 50%, 0.5)'
    onChange={changeSpy} />);

  it('emits a change object with values', function() {
    wrapper.find('.cp-mode-hsv').simulate('click');
    expect(changeSpy.getCall(0).args[0]).toEqual({
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

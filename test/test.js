'use strict';

var test = require('tape');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var Colorpickr = require('../');

test('component basics', (t) => {

  let onChangeObj;
  function _onChange(color) {
    onChangeObj = color;
  }

  const colorpickr = TestUtils.renderIntoDocument(
    <Colorpickr onChange={_onChange} />
  );

  t.ok(colorpickr, 'colorpickr componet is rendered in document');
  const r = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'rgb-attribute-r').getDOMNode();
  const g = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'rgb-attribute-g').getDOMNode();
  const b = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'rgb-attribute-b').getDOMNode();

  const hex = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'cp-hex-input').getDOMNode();

  const HSVTab = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'cp-mode-hsv').getDOMNode();
  const colorSlider = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'cp-colormode-slider').getDOMNode();
  const alphaSlider = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'cp-opacity').getDOMNode();

  t.equal(hex.value, '3887be', 'default HEX value is present');

  // TEST RGB MODE
  r.value = 255;
  TestUtils.Simulate.change(r);
  TestUtils.Simulate.focus(r);
  t.equal(colorSlider.classList.contains('r'), true, 'slider for RGB (r) is present when RGB (r) input is in focus.');

  g.value = 255;
  TestUtils.Simulate.change(g);
  TestUtils.Simulate.focus(g);
  t.equal(colorSlider.classList.contains('g'), true, 'slider for RGB (g) is present when RGB (g) input is in focus.');

  b.value = 255;
  TestUtils.Simulate.change(b);
  TestUtils.Simulate.focus(b);
  t.equal(colorSlider.classList.contains('b'), true, 'slider for RGB (b) is present when RGB (g) input is in focus.');

  t.equal(hex.value, 'ffffff', 'RGB inputs update HEX to #ffffff');

  // SWITCH TO HSV MODE
  TestUtils.Simulate.click(HSVTab);
  t.equal(HSVTab.classList.contains('cp-active'), true, 'HSV tab is active');

  const h = TestUtils.scryRenderedDOMComponentsWithClass(colorpickr, 'hsv-attribute-h')[0].getDOMNode();
  const s = TestUtils.scryRenderedDOMComponentsWithClass(colorpickr, 'hsv-attribute-s')[0].getDOMNode();
  const v = TestUtils.scryRenderedDOMComponentsWithClass(colorpickr, 'hsv-attribute-v')[0].getDOMNode();

  t.equal(h.value, '0', 'HSV attribute H is present and its value onChange');
  t.equal(s.value, '0', 'HSV attribute S is present and its value onChange');
  t.equal(v.value, '100', 'HSV attribute V is present and its value onChange');

  TestUtils.Simulate.focus(h);
  t.equal(colorSlider.classList.contains('h'), true, 'slider for hue is present when HSV (h) input is in focus.');

  TestUtils.Simulate.focus(s);
  t.equal(colorSlider.classList.contains('s'), true, 'slider for saturation is present when HSV (s) input is in focus.');

  TestUtils.Simulate.focus(v);
  t.equal(colorSlider.classList.contains('v'), true, 'slider for value is present when HSV (v) input is in focus.');

  t.end();
});

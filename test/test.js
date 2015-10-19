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

  function find(className) {
    return TestUtils.findRenderedDOMComponentWithClass(colorpickr, className).getDOMNode();
  }

  const colorpickr = TestUtils.renderIntoDocument(
    <Colorpickr onChange={_onChange} />
  );

  t.ok(colorpickr, 'colorpickr component is rendered in document');

  const r = find('rgb-attribute-r');
  const g = find('rgb-attribute-g');
  const b = find('rgb-attribute-b');

  const hex = find('cp-hex-input');

  const HSVTab = find('cp-mode-hsv');
  const colorSlider = find('cp-colormode-slider');

  const colorSliderInput = find('cp-colormode-slider-input');
  const alphaSliderInput = find('cp-alpha-slider-input');

  // Default options are intact
  const reset = find('cp-swatch-reset');
  t.ok(reset, 'Reset option is present by default');

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

  const h = find('hsv-attribute-h');
  const s = find('hsv-attribute-s');
  const v = find('hsv-attribute-v');

  t.equal(h.value, '0', 'HSV attribute H is present and its value onChange');
  t.equal(s.value, '0', 'HSV attribute S is present and its value onChange');
  t.equal(v.value, '100', 'HSV attribute V is present and its value onChange');

  TestUtils.Simulate.focus(h);
  t.equal(colorSlider.classList.contains('h'), true, 'slider for hue is present when HSV (h) input is in focus.');

  TestUtils.Simulate.focus(s);
  t.equal(colorSlider.classList.contains('s'), true, 'slider for saturation is present when HSV (s) input is in focus.');

  TestUtils.Simulate.focus(v);
  t.equal(colorSlider.classList.contains('v'), true, 'slider for value is present when HSV (v) input is in focus.');

  colorSliderInput.value = 0;
  TestUtils.Simulate.change(colorSliderInput);

  t.equal(v.value, '0', 'HSV (v) input attribute changed to 0 after adjusting the color slider');
  TestUtils.Simulate.change(v);

  t.equal(hex.value, '000000', 'input updates HEX to #000000');

  alphaSliderInput.value = 50;
  TestUtils.Simulate.change(alphaSliderInput);
  t.equal(onChangeObj.a, 0.5, 'alpha output is adjusted');

  t.end();
});

test('component options', (t) => {

  let onChangeObj;
  function _onChange(color) {
    onChangeObj = color;
  }

  function find(className) {
    return TestUtils.findRenderedDOMComponentWithClass(colorpickr, className).getDOMNode();
  }

  const colorpickr = TestUtils.renderIntoDocument(
    <Colorpickr
      reset={false}
      colorAttribute={'g'}
      mode={'hsv'}
      value={'#000'}
      onChange={_onChange}
    />
  );

  t.ok(colorpickr, 'colorpickr component with options is rendered in document');

  const reset = TestUtils.scryRenderedDOMComponentsWithClass(colorpickr, 'cp-swatch-reset');
  t.notOk(reset.length > 0, 'Reset is not present when false is passed');

  const colorSlider = find('cp-colormode-slider');
  t.equal(colorSlider.classList.contains('g'), true, 'Color attribute RGB (g) is active');

  const h = find('hsv-attribute-h');
  t.ok(h, 'Hue attribute element is present which means its tab is open');

  const hex = find('cp-hex-input');
  t.equal(hex.value, '000', 'Hex value is equal to value passed');
  TestUtils.Simulate.change(hex);

  const expectOnChangeToBe = {
    h: 0,
    s: 0,
    v: 0,
    r: 0,
    g: 0,
    b: 0,
    a: 1,
    hex: '000',
    input: 'hex',
    mode: 'hsv',
    colorAttribute: 'g'
  };

  t.deepEqual(onChangeObj, expectOnChangeToBe, 'onChange object reflects options passed');
  t.end();
});

test('rgb value', (t) => {

  let onChangeObj;
  function _onChange(color) {
    onChangeObj = color;
  }

  const colorpickr = TestUtils.renderIntoDocument(
    <Colorpickr
      value={'rgb(0,255,255)'}
      onChange={_onChange}
    />
  );

  t.ok(colorpickr, 'colorpickr component with options is rendered in document');

  TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'cp-hex-input').getDOMNode());

  const expectOnChangeToBe = {
    h: 180,
    s: 100,
    v: 100,
    r: 0,
    g: 255,
    b: 255,
    a: 1,
    hex: '0ff',
    input: 'hex',
    mode: 'rgb',
    colorAttribute: 'h'
  };

  t.deepEqual(onChangeObj, expectOnChangeToBe, 'onChange object reflects options passed');
  t.end();
});

test('rgba value', (t) => {

  let onChangeObj;
  function _onChange(color) {
    onChangeObj = color;
  }

  const colorpickr = TestUtils.renderIntoDocument(
    <Colorpickr
      value={'rgba(0,255,255,0.5)'}
      onChange={_onChange}
    />
  );

  t.ok(colorpickr, 'colorpickr component with options is rendered in document');

  TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'cp-hex-input').getDOMNode());

  const expectOnChangeToBe = {
    h: 180,
    s: 100,
    v: 100,
    r: 0,
    g: 255,
    b: 255,
    a: 0.5,
    hex: '0ff',
    mode: 'rgb',
    input: 'hex',
    colorAttribute: 'h'
  };

  t.deepEqual(onChangeObj, expectOnChangeToBe, 'onChange object reflects options passed');
  t.end();
});

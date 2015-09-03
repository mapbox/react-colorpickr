'use strict';

var test = require('tape');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var Colorpickr = require('../');

test('basics', (t) => {

  function _onChange(color) {
    console.log('on Change occured');
  }

  const colorpickr = TestUtils.renderIntoDocument(
    <Colorpickr
      onChange={_onChange}
    />
  );

  t.ok(colorpickr, 'colorpickr componet is rendered in the document');
  const r = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'rgb-attribute-r').getDOMNode();
  const g = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'rgb-attribute-g').getDOMNode();
  const b = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'rgb-attribute-b').getDOMNode();

  const hex = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'cp-hex-input').getDOMNode();

  const HSVTab = TestUtils.findRenderedDOMComponentWithClass(colorpickr, 'cp-mode-hsv').getDOMNode();

  t.equal(hex.value, '3887be', 'Default HEX value is present');

  r.value = 255;
  TestUtils.Simulate.change(r);

  g.value = 255;
  TestUtils.Simulate.change(g);

  b.value = 255;
  TestUtils.Simulate.change(b);

  t.equal(hex.value, 'ffffff', 'RGB inputs update HEX to #ffffff');

  // TODO Why does TestUtils.Simulate.click(HSVTab); not work?

  /*
  TestUtils.Simulate.click(HSVTab);
  t.equal(HSVTab.getDOMNode().classList.contains('cp-active'), true, 'HSV tab is active');

  const h = TestUtils.scryRenderedDOMComponentsWithClass(colorpickr, 'hsv-attribute-h')[0].getDOMNode();
  const s = TestUtils.scryRenderedDOMComponentsWithClass(colorpickr, 'hsv-attribute-s')[0].getDOMNode();
  const v = TestUtils.scryRenderedDOMComponentsWithClass(colorpickr, 'hsv-attribute-v')[0].getDOMNode();

  t.equal(h.value, 0, 'HSV attribute H is present and its value onChange');
  t.equal(s.value, 0, 'HSV attribute S is present and its value onChange');
  t.equal(v.value, 100, 'HSV attribute V is present and its value onChange');
  */

  t.end();
});

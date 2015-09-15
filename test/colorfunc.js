'use strict';

var test = require('tape'),
  colorfunc = require('../src/colorfunc');

test('hsv2hex', function(t) {
  t.equal(colorfunc.hsv2hex(0, 0, 0), '000000');
  t.equal(colorfunc.hsv2hex(10, 10, 10), '1a1717');
  t.equal(colorfunc.hsv2hex(20, 10, 10), '1a1817');
  t.equal(colorfunc.hsv2hex(20, 20, 10), '1a1614');
  t.equal(colorfunc.hsv2hex(20, 20, 20), '332c29');
  t.end();
});

test('rgb2hsv', function(t) {
  t.deepEqual(colorfunc.rgb2hsv(0, 0, 0), { h: 0, s: 0, v: 0 });
  t.deepEqual(colorfunc.rgb2hsv(10, 10, 10), { h: 0, s: 0, v: 4 });
  t.deepEqual(colorfunc.rgb2hsv(20, 10, 10), { h: 0, s: 50, v: 8 });
  t.end();
});

test('hsv2rgb', function(t) {
  t.deepEqual(colorfunc.hsv2rgb(0, 0, 0), { r: 0, g: 0, b: 0 });
  t.deepEqual(colorfunc.hsv2rgb(10, 10, 10), { b: 23, g: 23, r: 26 });
  t.deepEqual(colorfunc.hsv2rgb(20, 10, 10), { b: 23, g: 24, r: 26 });
  t.end();
});

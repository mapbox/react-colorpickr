'use strict';

var colorfunc = require('../src/colorfunc');
var expect = require('expect');

describe('colorfunc', function() {

  it('hsv2hex', function() {
    expect(colorfunc.hsv2hex(0, 0, 0)).toEqual('000000');
    expect(colorfunc.hsv2hex(10, 10, 10)).toEqual('1a1717');
    expect(colorfunc.hsv2hex(20, 10, 10)).toEqual('1a1817');
    expect(colorfunc.hsv2hex(20, 20, 10)).toEqual('1a1614');
    expect(colorfunc.hsv2hex(20, 20, 20)).toEqual('332c29');
  });

  it('rgb2hsv', function() {
    expect(colorfunc.rgb2hsv(0, 0, 0)).toEqual({ h: 0, s: 0, v: 0 });
    expect(colorfunc.rgb2hsv(10, 10, 10)).toEqual({ h: 0, s: 0, v: 4 });
    expect(colorfunc.rgb2hsv(20, 10, 10)).toEqual({ h: 0, s: 50, v: 8 });
  });

  it('hsv2rgb', function() {
    expect(colorfunc.hsv2rgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 });
    expect(colorfunc.hsv2rgb(10, 10, 10)).toEqual({ b: 23, g: 23, r: 26 });
    expect(colorfunc.hsv2rgb(20, 10, 10)).toEqual({ b: 23, g: 24, r: 26 });
  });

  it('getColor should not convert hex to shorthand if full color is entered', function() {
    var convertedLonghandColor = colorfunc.getColor('#000000');
    expect(convertedLonghandColor.hex).toEqual('000000');
  });

  it('getColor should convert hex to shorthand if shorthand is entered', function() {
    var convertedShorthandColor = colorfunc.getColor('#000');
    expect(convertedShorthandColor.hex).toEqual('000');
  });
});

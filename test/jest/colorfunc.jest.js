'use strict';

import * as colorfunc from '../../src/colorfunc';

describe('colorfunc', () => {

  test('hsv2hex', () => {
    expect(colorfunc.hsv2hex(0, 0, 0)).toBe('000000');
    expect(colorfunc.hsv2hex(10, 10, 10)).toBe('1a1717');
    expect(colorfunc.hsv2hex(20, 10, 10)).toBe('1a1817');
    expect(colorfunc.hsv2hex(20, 20, 10)).toBe('1a1614');
    expect(colorfunc.hsv2hex(20, 20, 20)).toBe('332c29');
  });

  test('rgb2hsv', () => {
    expect(colorfunc.rgb2hsv(0, 0, 0)).toEqual({ h: 0, s: 0, v: 0 });
    expect(colorfunc.rgb2hsv(10, 10, 10)).toEqual({ h: 0, s: 0, v: 4 });
    expect(colorfunc.rgb2hsv(20, 10, 10)).toEqual({ h: 0, s: 50, v: 8 });
  });

  test('hsv2rgb', () => {
    expect(colorfunc.hsv2rgb(0,0,0)).toEqual({ r: 0, g: 0, b: 0});
    expect(colorfunc.hsv2rgb(10, 10, 10)).toEqual({ b: 23, g: 23, r: 26 });
    expect(colorfunc.hsv2rgb(20, 10, 10)).toEqual({ b: 23, g: 24, r: 26 });
  });

  test('getColor should not convert hex to shorthand if full color is entered', () => {
    var convertedLonghandColor = colorfunc.getColor('#000000');
    expect(convertedLonghandColor.hex).toBe('000000');
  });

  test('getColor should convert hex to shorthand if shorthand is entered', () => {
    var convertedShorthandColor = colorfunc.getColor('#000');
    expect(convertedShorthandColor.hex).toBe('000');
  });
});

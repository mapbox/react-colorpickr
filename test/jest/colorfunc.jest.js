'use strict';

import * as colorfunc from '../../src/colorfunc';

describe('colorfunc', () => {

  test('rgb2hsl', () => {
    expect(colorfunc.rgb2hsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
    expect(colorfunc.rgb2hsl(10, 10, 10)).toEqual({ h: 0, s: 0, l: 4 });
    expect(colorfunc.rgb2hsl(20, 10, 10)).toEqual({ h: 0, s: 33, l: 6 });
  });

  test('hsl2rgb', () => {
    expect(colorfunc.hsl2rgb(0,0,0)).toEqual({ r: 0, g: 0, b: 0});
    expect(colorfunc.hsl2rgb(10, 10, 10)).toEqual({ b: 23, g: 24, r: 28 });
    expect(colorfunc.hsl2rgb(20, 10, 10)).toEqual({ b: 23, g: 25, r: 28 });
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

'use strict';

var convert = require('colr-convert');
var tinyColor = require('tinycolor2');

var colorFunc = {

  isDark(color) {
    return color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114 > 186 || color[3] < 0.5;
  },

  getColor(cssColor) {
    // With tinyColor, invalid colors are treated as black
    var color = tinyColor(cssColor),
        rgba = color.toRgb(),
        hsv = color.toHsv(),
        hex = color.toHex();

    //check if full length color is entered, if so don't convert to short hand even if possible to.
    var isSixDigitHexColor = cssColor.length === 7;

    // Convert to shorthand hex if applicable
    if (!isSixDigitHexColor && hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
      hex = [hex[0], hex[2], hex[4]].join('');
    }

    return {
      h: Math.round(hsv.h),
      s: Math.round(hsv.s * 100),
      v: Math.round(hsv.v * 100),
      r: Math.round(rgba.r),
      g: Math.round(rgba.g),
      b: Math.round(rgba.b),
      a: rgba.a,
      hex: hex
    };
  },

  rgbaColor(r, g, b, a) {
    return 'rgba(' + [r, g, b, a / 100].join(',') + ')';
  },

  hsv2hex(h, s, v) {
    var rgb = convert.hsv.rgb([h, s, v]);
    return convert.rgb.hex([Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])]).slice(1);
  },

  hsv2rgb(h, s, v) {
    var rgb = convert.hsv.rgb([h, s, v]);
    return {
      r: Math.round(rgb[0]),
      g: Math.round(rgb[1]),
      b: Math.round(rgb[2])
    };
  },

  rgb2hex(r, g, b) {
    return convert.rgb.hex([r, g, b]).slice(1);
  },

  rgb2hsv(r, g, b) {
    var hsv = convert.rgb.hsv([r, g, b]);
    return {
      h: Math.round(hsv[0]),
      s: Math.round(hsv[1]),
      v: Math.round(hsv[2])
    };
  },

  /**
   * Determine x y coordinates based on color mode.
   *
   * R: x = b, y = g
   * G: x = b, y = r
   * B: x = r, y = g
   *
   * H: x = s, y = v
   * S: x = h, y = v
   * V: x = h, y = s
   *
   * @param {string} mode one of `r`, `g`, `b`, `h`, `s`, or `v`
   * @param {Object} color a color object of current values associated to key
   * @return {Object} coordinates
   */
  colorCoords(mode, color) {
    var x, y, xmax, ymax;
    if (mode === 'r' || mode === 'g' || mode === 'b') {
      xmax = 255;ymax = 255;
      if (mode === 'r') {
        x = color.b;
        y = 255 - color.g;
      } else if (mode === 'g') {
        x = color.b;
        y = 255 - color.r;
      } else {
        x = color.r;
        y = 255 - color.g;
      }
    } else if (mode === 'h') {
      xmax = 100;ymax = 100;
      x = color.s;
      y = 100 - color.v;
    } else if (mode === 's') {
      xmax = 359;ymax = 100;
      x = color.h;
      y = 100 - color.v;
    } else if (mode === 'v') {
      xmax = 359;ymax = 100;
      x = color.h;
      y = 100 - color.s;
    }

    return {
      x: x,
      y: y,
      xmax: xmax,
      ymax: ymax
    };
  },

  /**
   * Takes a mode and returns its sibling values based on x,y positions
   *
   * R: x = b, y = g
   * G: x = b, y = r
   * B: x = r, y = g
   *
   * H: x = s, y = v
   * S: x = h, y = v
   * V: x = h, y = s
   *
   * @param {string} mode one of `r`, `g`, `b`, `h`, `s`, or `v`
   * @param {Object} pos x, y coordinates
   * @return {Object} Changed sibling values
   */
  colorCoordValue(mode, pos) {
    var color = {};
    pos.x = Math.round(pos.x);
    pos.y = Math.round(pos.y);

    switch (mode) {
      case 'r':
        color.b = pos.x;
        color.g = 255 - pos.y;
        break;
      case 'g':
        color.b = pos.x;
        color.r = 255 - pos.y;
        break;
      case 'b':
        color.r = pos.x;
        color.g = 255 - pos.y;
        break;
      case 'h':
        color.s = pos.x;
        color.v = 100 - pos.y;
        break;
      case 's':
        color.h = pos.x;
        color.v = 100 - pos.y;
        break;
      case 'v':
        color.h = pos.x;
        color.s = 100 - pos.y;
        break;
    }

    return color;
  }
};

module.exports = colorFunc;
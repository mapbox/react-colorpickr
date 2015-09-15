'use strict';

var convert = require('colr-convert');
var { parseCSSColor } = require('csscolorparser');

var colorFunc = {
  rgbaColor(r, g, b, a) {
    return 'rgba(' + [r, g, b, a / 100].join(',') + ')';
  },
  isDark(color) {
    return (color.rgb[0] * 0.299) + (color.rgb[1] * 0.587) + (color.rgb[2] * 0.114) > 186 ||
      color.alpha < 0.5;
  },
  getColor(cssColor) {
    var rgba = parseCSSColor(cssColor);
    if (rgba) {
      return {
        hsv: convert.rgb.hsv(rgba),
        hex: convert.rgb.hex(rgba),
        rgb: rgba,
        alpha: rgba[3]
      };
    }
    else {
      return null;
    }
  },
  hsv2rgb(h, s, v) {
    return convert.hsv.rgb([h, s, v]).map(Math.round);
  },
  rgb2hex(rgb) {
    return convert.rgb.hex([rgb]).slice(1);
  },
  rgb2hsv(r, g, b) {
    return convert.rgb.hsv([r, g, b]).map(Math.round);
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
      xmax = 255; ymax = 255;
      if (mode === 'r') {
        x = color.b;
        y = (255 - color.g);
      } else if (mode === 'g') {
        x = color.b;
        y = (255 - color.r);
      } else {
        x = color.r;
        y = (255 - color.g);
      }
    } else if (mode === 'h') {
      xmax = 100; ymax = 100;
      x = color.s;
      y = (100 - color.v);
    } else if (mode === 's') {
      xmax = 359; ymax = 100;
      x = color.h;
      y = (100 - color.v);
    } else if (mode === 'v') {
      xmax = 359; ymax = 100;
      x = color.h;
      y = (100 - color.s);
    }

    return { x, y, ymax, xmax };
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

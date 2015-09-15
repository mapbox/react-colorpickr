'use strict';

var convert = require('colr-convert');
var extend = require('xtend');
var { parseCSSColor } = require('csscolorparser');

var colorFunc = {
  rgbaColor(r, g, b, a) {
    return 'rgba(' + [r, g, b, a / 100].join(',') + ')';
  },
  isDark(color) {
    return (color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114) > 186 ||
      color.a < 0.5;
  },
  getColor(cssColor) {
    var rgba = parseCSSColor(cssColor);
    if (rgba) {
      var [r, g, b, a] = rgba;
      var hsv = colorFunc.rgb2hsv(r, g, b);
      var hex = colorFunc.rgb2hex(r, g, b);

      // Convert to shorthand hex is applicable
      if (hex[0] === hex[1] &&
          hex[2] === hex[3] &&
          hex[4] === hex[5]) {
        hex = [hex[0], hex[2], hex[4]].join('');
      }

      return extend(hsv, { r, g, b, a, hex });
    }
    else {
      return null;
    }
  },
  hsv2hex(h, s, v) {
    return convert.rgb.hex(convert.hsv.rgb([h, s, v]).map(Math.round)).slice(1);
  },
  hsv2rgb(h, s, v) {
    return colorFunc.zip(['r', 'g', 'b'], convert.hsv.rgb([h, s, v]).map(Math.round));
  },
  zip(a, b) {
    return a.reduce((memo, key, i) => { memo[key] = b[i]; return memo; }, {});
  },
  rgb2hex(r, g, b) {
    return convert.rgb.hex([r, g, b]).slice(1);
  },
  rgb2hsv(r, g, b) {
    return colorFunc.zip(['h', 's', 'v'], convert.rgb.hsv([r, g, b]).map(Math.round));
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

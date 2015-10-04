'use strict';

var convert = require('colr-convert');
var { parseCSSColor } = require('csscolorparser');

var colorFunc = {
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
        rgb: rgba.slice(0, 3),
        alpha: rgba[3]
      };
    }
    else {
      return null;
    }
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
    return {
      r: { ymax: 255, xmax: 255, x: color.rgb[2], y: 255 - color.rgb[1] },
      g: { ymax: 255, xmax: 255, x: color.rgb[1], y: 255 - color.rgb[0] },
      b: { ymax: 255, xmax: 255, x: color.rgb[0], y: 255 - color.rgb[1] },
      h: { ymax: 100, xmax: 100, x: color.hsv[1], y: 100 - color.hsv[2] },
      s: { ymax: 100, xmax: 359, x: color.hsv[0], y: 100 - color.hsv[2] },
      v: { ymax: 100, xmax: 359, x: color.hsv[0], y: 100 - color.hsv[1] }
    }[mode];
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
  },
  colorIndex(attribute) {
    var rgb = ['r', 'g', 'b'].indexOf(attribute);
    var hsv = ['h', 's', 'v'].indexOf(attribute);
    return (rgb !== -1) ? rgb : hsv;
  }
};

module.exports = colorFunc;

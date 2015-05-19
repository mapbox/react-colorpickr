'use strict';

var colorFunc = {

  getRGBA: function(r, g, b, a) {
    return 'rgba('+
      [r, g, b, a / 100].join(',') + ')';
  },

  hsv2hex: function(h, s, v) {
    var rgb = colorFunc.hsv2rgb(h, s, v);
    return colorFunc.rgb2hex(rgb.r, rgb.g, rgb.b);
  },

  hsv2rgb: function(h, s, v) {
    // http:/rapidtables.com/convert/color/hsv-to-rgb/
    s = s / 100;
    v = v / 100;
    var rgb = [];

    var c = v * s;
    var hh = h / 60;
    var x = c * (1 - Math.abs(hh % 2 - 1));
    var m = v - c;

    switch(parseInt(hh, 10)) {
      case 0:
        rgb = [c, x, 0];
      break;
      case 1:
        rgb = [x, c, 0];
      break;
      case 2:
        rgb = [0, c, x];
      break;
      case 3:
        rgb = [0, x, c];
      break;
      case 4:
        rgb = [x, 0, c];
      break;
      case 5:
        rgb = [c, 0, x];
      break;
    }

    return {
      r: Math.round(255 * (rgb[0] + m)),
      g: Math.round(255 * (rgb[1] + m)),
      b: Math.round(255 * (rgb[2] + m))
    };
  },

  rgb2hex: function(r, g, b) {
    function _convert(num) {
      var hex = num.toString(16);
      return (hex.length === 1) ? '0' + hex : hex;
    }

    return [
      _convert(r),
      _convert(g),
      _convert(b)
    ].join('');
  },

  rgb2hsv: function(r, g, b) {
    // http://rapidtables.com/convert/color/rgb-to-hsv/
    var h, s, v;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;

    // hue
    if (delta === 0) {
      h = 0;
    } else if (r === max) {
      h = ((g - b) / delta) % 6;
    } else if (g === max) {
      h = (b - r) / delta + 2;
    } else if (b === max) {
      h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    // saturation
    s = Math.round((max === 0 ? 0 : (delta / max)) * 100);

    // value
    v = Math.round(max / 255 * 100);

    return {
      h: h,
      s: s,
      v: v
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
  colorCoords: function(mode, color) {
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
  colorCoordValue: function(mode, pos) {
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

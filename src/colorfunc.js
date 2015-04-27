'use strict';

var colorFunc = {

  getRGBA: function(r, g, b, a) {
    return 'rgba('+
      [r, g, b, a / 100].join(',') + ')';
  },

  hex2rgb: function(hex) {
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
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

  rgb2hex: function(r, g, b, hashtag) {
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
  }
};

module.exports = colorFunc;

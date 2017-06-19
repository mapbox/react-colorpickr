'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorCoordValue = exports.colorCoords = exports.rgb2hsv = exports.rgb2hex = exports.hsv2rgb = exports.hsv2hex = exports.rgbaColor = exports.getColor = exports.isDark = undefined;

var _colrConvert = require('colr-convert');

var _colrConvert2 = _interopRequireDefault(_colrConvert);

var _tinycolor = require('tinycolor2');

var _tinycolor2 = _interopRequireDefault(_tinycolor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isDark(color) {
  return color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114 > 186 || color[3] < 0.5;
}

function getColor(cssColor) {
  // With tinyColor, invalid colors are treated as black
  var color = (0, _tinycolor2.default)(cssColor);
  var rgba = color.toRgb();
  var hsv = color.toHsv();
  var hex = color.toHex();

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
}

function rgbaColor(r, g, b, a) {
  return 'rgba(' + [r, g, b, a / 100].join(',') + ')';
}

function hsv2hex(h, s, v) {
  var rgb = _colrConvert2.default.hsv.rgb([h, s, v]);
  return _colrConvert2.default.rgb.hex([Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])]).slice(1);
}

function hsv2rgb(h, s, v) {
  var rgb = _colrConvert2.default.hsv.rgb([h, s, v]);
  return {
    r: Math.round(rgb[0]),
    g: Math.round(rgb[1]),
    b: Math.round(rgb[2])
  };
}

function rgb2hex(r, g, b) {
  return _colrConvert2.default.rgb.hex([r, g, b]).slice(1);
}

function rgb2hsv(r, g, b) {
  var hsv = _colrConvert2.default.rgb.hsv([r, g, b]);
  return {
    h: Math.round(hsv[0]),
    s: Math.round(hsv[1]),
    v: Math.round(hsv[2])
  };
}

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
function colorCoords(mode, color) {
  var x = void 0,
      y = void 0,
      xmax = void 0,
      ymax = void 0;
  if (mode === 'r' || mode === 'g' || mode === 'b') {
    xmax = 255;
    ymax = 255;
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
    xmax = 100;
    ymax = 100;
    x = color.s;
    y = 100 - color.v;
  } else if (mode === 's') {
    xmax = 359;
    ymax = 100;
    x = color.h;
    y = 100 - color.v;
  } else if (mode === 'v') {
    xmax = 359;
    ymax = 100;
    x = color.h;
    y = 100 - color.s;
  }

  return {
    x: x,
    y: y,
    xmax: xmax,
    ymax: ymax
  };
}

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
function colorCoordValue(mode, pos) {
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

exports.isDark = isDark;
exports.getColor = getColor;
exports.rgbaColor = rgbaColor;
exports.hsv2hex = hsv2hex;
exports.hsv2rgb = hsv2rgb;
exports.rgb2hex = rgb2hex;
exports.rgb2hsv = rgb2hsv;
exports.colorCoords = colorCoords;
exports.colorCoordValue = colorCoordValue;
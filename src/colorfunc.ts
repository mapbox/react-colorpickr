import Color from 'color';
import colorString from 'color-string';

function isDark(color) {
  return (
    color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114 > 186 ||
    color[3] < 0.5
  );
}

function normalizeHex(hex) {
  // Knock off the # and lowercase;
  return hex.substring(1).toLowerCase();
}

function getColor(cssColor) {
  const isValid = colorString.get(cssColor);

  const color = Color(isValid ? cssColor : '#000');
  const { r, g, b, alpha } = color.rgb().object();
  const { h, s, l } = color.hsl().object();

  let hex;

  // If a short hex came in, accept it as value.
  if (isValid && cssColor.length === 4) {
    hex = normalizeHex(cssColor);
  } else {
    hex = normalizeHex(color.hex());
  }

  return {
    h: Math.round(h),
    s: Math.round(s),
    l: Math.round(l),
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    a: isNaN(alpha) ? 1 : alpha,
    hex
  };
}

function hsl2rgb(h, s, l) {
  const { r, g, b } = Color({ h, s, l }).rgb().object();
  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b)
  };
}

function rgb2hex(r, g, b) {
  return normalizeHex(Color({ r, g, b }).hex());
}

function rgb2hsl(r, g, b) {
  const { h, s, l } = Color({ r, g, b }).hsl().object();
  return {
    h: Math.round(h),
    s: Math.round(s),
    l: Math.round(l)
  };
}

/**
 * Determine x y coordinates based on color channel.
 *
 * R: x = b, y = g
 * G: x = b, y = r
 * B: x = r, y = g
 *
 * H: x = s, y = l
 * S: x = h, y = l
 * L: x = h, y = s
 *
 * @param {string} channel one of `r`, `g`, `b`, `h`, `s`, or `l`
 * @param {Object} color a color object of current values associated to key
 * @return {Object} coordinates
 */
function colorCoords(channel, color) {
  let x, y, xmax, ymax;
  switch (channel) {
    case 'r':
      xmax = 255;
      ymax = 255;
      x = color.b;
      y = ymax - color.g;
      break;
    case 'g':
      xmax = 255;
      ymax = 255;
      x = color.b;
      y = ymax - color.r;
      break;
    case 'b':
      xmax = 255;
      ymax = 255;
      x = color.r;
      y = ymax - color.g;
      break;
    case 'h':
      xmax = 100;
      ymax = 100;
      x = color.s;
      y = ymax - color.l;
      break;
    case 's':
      xmax = 360;
      ymax = 100;
      x = color.h;
      y = ymax - color.l;
      break;
    case 'l':
      xmax = 360;
      ymax = 100;
      x = color.h;
      y = ymax - color.s;
      break;
  }

  return { xmax, ymax, x, y };
}

/**
 * Takes a channel and returns its sibling values based on x,y positions
 *
 * R: x = b, y = g
 * G: x = b, y = r
 * B: x = r, y = g
 *
 * H: x = s, y = l
 * S: x = h, y = l
 * L: x = h, y = s
 *
 * @param {string} channel one of `r`, `g`, `b`, `h`, `s`, or `l`
 * @param {Object} pos x, y coordinates
 * @return {Object} Changed sibling values
 */
function colorCoordValue(channel, pos) {
  const color = {};
  pos.x = Math.round(pos.x);
  pos.y = Math.round(pos.y);

  switch (channel) {
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
      color.l = 100 - pos.y;
      break;
    case 's':
      color.h = pos.x;
      color.l = 100 - pos.y;
      break;
    case 'l':
      color.h = pos.x;
      color.s = 100 - pos.y;
      break;
  }

  return color;
}

export {
  isDark,
  getColor,
  hsl2rgb,
  rgb2hex,
  rgb2hsl,
  colorCoords,
  colorCoordValue
};

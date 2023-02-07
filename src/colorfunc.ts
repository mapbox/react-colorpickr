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

export { isDark, getColor, hsl2rgb, rgb2hex, rgb2hsl };

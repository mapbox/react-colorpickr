module.exports.isDark = color =>
  ((color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114) > 186 || color.a < 0.50);

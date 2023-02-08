// Generate an autokey to be used with react-themeable
type Theme = { [key: string]: string };

export const autokey = (func: (themeObject: Theme) => void) => {
  let autoKey = 1;
  return (...names: Array<unknown>) => func.apply(null, [autoKey++, ...names]);
};

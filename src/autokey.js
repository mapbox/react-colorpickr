/* Generate an autokey to be used with react-themeable */
export const autokey = (func) => {
  let autoKey = 1
  return (...names) => func(autoKey++, ...names)
}

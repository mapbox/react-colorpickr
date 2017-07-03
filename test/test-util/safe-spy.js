/* global jest */
// If jest.fn is available in the env, use it;
// otherwise, just provide an empty function.
function safeSpy() {
  if (typeof jest !== 'undefined' && typeof jest.fn === 'function') {
    return jest.fn();
  }
  return function() {};
}

export { safeSpy };

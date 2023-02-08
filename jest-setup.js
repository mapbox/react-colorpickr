/* eslint-disable */
global.ResizeObserver = class ResizeObserver {
  x;
  constructor(cb) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve() {}
  disconnect() {}
};

class DOMException extends Error {
  constructor(message) {
    super(message);
    this.name = 'DOMException';
  }
}

const abortSignal = () => {
  return new DOMException(
    "Failed to execute 'open' on 'EyeDropper': Color selection aborted."
  );
};
const abortSignalDuring = () => {
  return new DOMException('Color selection aborted.');
};

global.EyeDropper = class EyeDropper {
  constructor() {}
  _getColor() {
    return 'rgba(255, 255, 255, 0)';
  }
  _setOpen() {
    EyeDropper.isOpen = true;
  }
  _setClosed() {
    EyeDropper.isOpen = false;
  }
  _getTimeout() {
    return 50;
  }
  open(options) {
    return new Promise((resolve, reject) => {
      const signal = options?.signal;
      const onAbortDuring = () => {
        clearTimeout(resolveTimeout);
        this._setClosed();
        reject(abortSignalDuring());
      };
      if (signal) {
        if (signal.aborted) {
          reject(abortSignal());
          return;
        }
        signal.addEventListener('abort', onAbortDuring);
      }
      this._setOpen();
      const resolveTimeout = setTimeout(() => {
        if (signal) signal.removeEventListener('abort', onAbortDuring);
        this._setClosed();
        resolve({ sRGBHex: this._getColor() });
      }, this._getTimeout());
    });
  }
};

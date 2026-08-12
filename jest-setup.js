/* eslint-disable */
// jsdom implements neither the Pointer Events interface nor pointer capture.
if (!global.PointerEvent) {
  global.PointerEvent = class PointerEvent extends MouseEvent {
    constructor(type, params = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 1;
      this.pointerType = params.pointerType ?? 'mouse';
    }
  };
}

const capturedPointers = new WeakMap();
Element.prototype.setPointerCapture = function (pointerId) {
  const ids = capturedPointers.get(this) ?? new Set();
  ids.add(pointerId);
  capturedPointers.set(this, ids);
};
Element.prototype.releasePointerCapture = function (pointerId) {
  capturedPointers.get(this)?.delete(pointerId);
};
Element.prototype.hasPointerCapture = function (pointerId) {
  return capturedPointers.get(this)?.has(pointerId) ?? false;
};
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

if (!global._babelPolyfill) {
  require('@babel/polyfill');
}

export default class RequestTarget {
  constructor(options = {}) {
    this._options = {
      callAllHandlers: typeof options.callAllHandlers === 'boolean' ? options.callAllHandlers : false,
      byRequest: options.byRequest || {}
    };
    this._handlers = {};
  }

  /**
   * @param {string} subject
   * @param {string} option
   * @return {any}
   */
  _getRequestOption(subject, option) {
    const options = this._options.byRequest[subject] || {};
    const globalOptions = this._options;

    return typeof options[option] !== 'undefined' ? options[option] : globalOptions[option];
  }

  /**
   * @param {string?} subject - If omitted, global options is assumed.
   * @param {object}  options
   */
  setOptions(arg1, arg2) {
    if (typeof arg2 === 'undefined') {
      const options = arg1;
      this._options = { ...this._options, ...options };
    } else {
      const subject = arg1;
      const options = arg2;

      if (this._options.byRequest[subject]) {
        this._options.byRequest[subject] = {
          ...this._options.byRequest[subject],
          ...options
        };
      } else {
        this._options.byRequest[subject] = options;
      }
    }

    return this;
  }

  /**
   * @param {string}          subject
   * @param {(...any) => any} handler - May return a Promise.
   * @return {this}
   */
  on(subject, handler) {
    const handlers = this._handlers[subject] || (this._handlers[subject] = []);

    handlers.push(handler);

    return this;
  }

  /**
   * @param {string}          subject
   * @param {(...any) => any} handler - May return a Promise.
   * @return {this}
   */
  off(subject, handler) {
    const handlers = this._handlers[subject];
    if (!handlers) { return this; }

    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }

    return this;
  }

  /**
   * @param {string} subject
   * @param {any[]}  args
   * @return {any} - Return undefined, if there are no request handlers.
   */
  request(subject, ...args) {
    const handlers = this._handlers[subject];
    if (!handlers || handlers.length === 0) {
      return;
    }

    const callAllHandlers = this._getRequestOption(subject, 'callAllHandlers');

    let result = undefined;
    for (const handler of handlers) {
      const _result = handler(...args);
      if (typeof _result !== 'undefined' && typeof result === 'undefined') {
        result = _result;
        if (!callAllHandlers) { return result; }
      }
    }

    return result;
  }
}
module.exports = RequestTarget;

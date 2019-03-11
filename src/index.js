class RequestTarget {
  /**
   * @param {object?}  options
   * @param {boolean?} options.callAllHandlers
   * @param {boolean?} options.getAllResults
   * @param {boolean?} options.autoPromiseAll
   * @param {object?}  options.byRequest
   * @param {boolean?} options.byRequest.{string}.callAllHandlers
   * @param {boolean?} options.byRequest.{string}.getAllResults
   * @param {boolean?} options.byRequest.{string}.autoPromiseAll
   */
  constructor(options = {}) {
    this._options = {
      callAllHandlers: typeof options.callAllHandlers === 'boolean' ? options.callAllHandlers : false,
      getAllResults: typeof options.getAllResults === 'boolean' ? options.getAllResults : false,
      autoPromiseAll: typeof options.autoPromiseAll === 'boolean' ? options.autoPromiseAll : true,
      byRequest: options.byRequest || {}
    };
    this._handlers = {};
  }

  /**
   * @param {string} subject
   * @param {string} option
   * @return {any}
   * @private
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
      Object.assign(this._options, options);
    } else {
      const subject = arg1;
      const options = arg2;

      if (this._options.byRequest[subject]) {
        Object.assign(this._options.byRequest[subject], options);
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
  addRequestHandler(subject, handler) { return this.on(subject, handler); }
  addHandler(subject, handler) { return this.on(subject, handler); }

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
  removeRequestHandler(subject, handler) { return this.off(subject, handler); }
  removeHandler(subject, handler) { return this.off(subject, handler); }

  /**
   * @param {string?} subject
   * @return {this}
   */
  offAll(subject = null) {
    if (subject) {
      delete this._handlers[subject];
    } else {
      this._handlers = {};
    }

    return this;
  }
  removeAllRequestHandlers(subject = null) { return this.offAll(subject); }
  removeAllHandlers(subject = null) { return this.offAll(subject); }

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
    const getAllResults = this._getRequestOption(subject, 'getAllResults');
    const autoPromiseAll = this._getRequestOption(subject, 'autoPromiseAll');

    if (getAllResults) {
      const results = [];
      let anyPromise = false

      handlers.forEach(handler => {
        const result = handler(...args);
        results.push(result);

        if (typeof result === 'object' && typeof result.then === 'function') {
          anyPromise = true;
        }
      });

      return anyPromise && autoPromiseAll ? Promise.all(results) : results;
    }

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

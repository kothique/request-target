if (!global._babelPolyfill) {
  require('@babel/polyfill');
}

export default class RequestTarget {
  constructor() {
    this._handlers = {};
  }

  /**
   * @param {string} subject
   * @param {any => any} handler
   * @return {this}
   */
  on(subject, handler) {
    const handlers = this._handlers[subject] || (this._handlers[subject] = []);

    handlers.push(handler);

    return this;
  }

  /**
   * @param {string} subject
   * @param {any => any} handler
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
   * @param {any}    data
   * @return {any} - Return undefined, if there are no request handlers.
   */
  request(subject, data) {
    const handlers = this._handlers[subject];
    if (!handlers || handlers.length === 0) {
      return;
    }

    for (const handler of handlers) {
      const result = handler(data);
      if (typeof result !== 'undefined') {
        return result;
      }
    }
  }
}
module.exports = RequestTarget;

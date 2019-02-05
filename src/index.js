if (!global._babelPolyfill) {
  require('@babel/polyfill');
}

export default class RequestTarget {
  constructor() {
    this.handlers = {};
  }

  on(subject, handler) {
    const rewrite = Boolean(this.handlers[subject]);

    this.handlers[subject] = handler;
    if (rewrite) {
      console.warn(`RequestTarget: rewriting existing handler: ${subject}.`);
    }

    return this;
  }

  off(subject) {
    delete this.handlers[subject];

    return this;
  }

  request(subject, data) {
    const handler = this.handlers[subject];
    if (!handler) {
      console.warn(`RequestTarget: no handler found: ${subject}.`);
    }

    return handler(data);
  }
}
module.exports = RequestTarget;

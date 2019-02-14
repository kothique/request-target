@kothique/request-target
============

It's like EventEmitter or EventTarget, but RequestTarget :}

## Examples

```js
import RequestTarget from '@kothique/request-target';

const rt = new RequestTarget;

/* Like EventEmitter.prototype.on */
rt.on('div', (a, b) => {
  if (a === b && b === Infinity) {
    throw new Error('how dare you?!');
  }

  return a / b;
});

/* Like EventEmitter.prototype.emit */
const result = rt.request('div', 42, 17);
console.log(`42 / 17 = ${result}`);

try {
  rt.request('div', Infinity, Infinity);
} catch (error) {
  console.log('Woops!');
}
```

### Documentation

#### Class: RequestTarget

##### `new RequestTarget(options = {})`

- `options.callAllHandlers` `boolean?` `default: false` If `true`, call all handlers even if a result was received.
- `options.getAllResults` `boolean?` `default: false` If `true`, results from all handlers are returned as an array on a request. Also, setting this option as `true` makes `options.callAllHandlers` `true` automatically.
- `options.autoPromiseAll` `boolean?` `default: true` If `true` and `options.getAllResults` is `true`, automatically applies `Promise.all` to the result of `RequestTarget#request` if there are any promises.
- `options.byRequest` `object?` The same options, but for specific requests.

```js
/* All request handlers will be evaluated except for 'first-response' request. */
const rt = new RequestTarget({
  callAllHandlers: true,
  byRequest: {
    'first-response': { callAllHandlers: false }
  }
});
```

##### `setOptions(options): this`

- `options` `object` Global options.

Shallow merge a given options object with global options.

##### `setOptions(subject, options): this`

- `subject` `string` Request subject.
- `options` `object` Request options.

Shallow merge a given options object with the options of the request with a given subject.

##### `on(subject, handler): this`

- `subject` `string` The name of the request.
- `handler` `(...any) => any` The handler can also return a `Promise`.

Add a handler for a given request type. Return `this`.

##### `off(subject, handler): this`

- `subject` `string` The name of the request.
- `handler` `(...any) => any` The handler passed to `RequestTarget#on`.

Remove a given request type's handler.

##### `request(subject, ...args): any`

- `subject` `string` The name of the request to send.
- `args` `any[]` Payload to send with the request.

Returns the result of the request on success, or throws an error. If there are
multiple request handlers, they will be evaluated until the first defined value
is returned or an error is thrown (unless `options.callAllHandlers` is set to `true`).
If `options.getAllResults` is `true`, all results will be returned as an array; also, if
`options.autoPromiseAll` is `true` and there is at least one promise returned from a handler,
`Promise.all` will be automatically applie to the resulting array. If all handlers return `undefined`,
or there are no handlers at all, returns `undefined`.

request-target
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

##### `new RequestTarget()`

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

Return the result of the request on success, or throw an error. If there are
multiple request handlers, they will be evaluated until the first defined value
is returned or an error is thrown. If all handlers return undefined, or there
are no handlers at all, returns undefined.

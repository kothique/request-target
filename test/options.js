import RequestTarget from '../src';

describe('options', function () {
  it('options.callAllHandlers is false', function () {
    this.rt = new RequestTarget({ callAllHandlers: false });

    const called = [];

    this.rt.on('meow', () => void called.push(1));
    this.rt.on('meow', () => {
      called.push(2);
      return 42;
    });
    this.rt.on('meow', () => void called.push(3));

    this.rt.request('meow');

    expect(called).to.eql([1, 2]);
  });

  it('options.callAllHandlers is true', function () {
    this.rt = new RequestTarget({ callAllHandlers: true });

    const called = [];

    this.rt.on('meow', () => void called.push(1));
    this.rt.on('meow', () => {
      called.push(2);
      return 42;
    });
    this.rt.on('meow', () => void called.push(3));

    this.rt.request('meow');

    expect(called).to.eql([1, 2, 3]);
  });

  it('options.callAllHandlers is true by request', function () {
    this.rt = new RequestTarget({
      callAllHandlers: false,
      byRequest: {
        'meow': { callAllHandlers: true },
        'boom': { callAllHandlers: false }
      }
    });

    const called = [];

    this.rt.on('meow', () => void called.push(1));
    this.rt.on('meow', () => {
      called.push(2);
      return 42;
    });
    this.rt.on('meow', () => void called.push(3));
    this.rt.on('boom', () => void called.push(4));
    this.rt.on('boom', () => {
      called.push(5);
      return 42;
    });
    this.rt.on('boom', () => void called.push(6));

    this.rt.request('meow');
    this.rt.request('boom');

    expect(called).to.eql([1, 2, 3, 4, 5]);
  });

  it('#setOptions for global options', function () {
    this.rt = new RequestTarget({ callAllHandlers: false });

    const called = [];

    this.rt.on('meow', () => called.push(1));
    this.rt.on('meow', () => void called.push(2));

    this.rt.request('meow');
    expect(called).to.eql([1]);

    called.length = 0;
    this.rt.setOptions({ callAllHandlers: true });
    this.rt.request('meow');
    expect(called).to.eql([1, 2]);
  });

  it('#setOptions for request options', function () {
    this.rt = new RequestTarget({ callAllHandlers: false });

    const called = [];

    this.rt.on('meow', () => called.push(1));
    this.rt.on('meow', () => void called.push(2));

    this.rt.request('meow');
    expect(called).to.eql([1]);

    this.rt.setOptions('meow', { callAllHandlers: true });

    called.length = 0;
    this.rt.request('meow');
    expect(called).to.eql([1, 2]);

    called.length = 0;
    this.rt.on('boom', () => called.push(1));
    this.rt.on('boom', () => void called.push(2));
    this.rt.request('boom');
    expect(called).to.eql([1]);
  });

  it('options.getAllResults with synchronous results', function () {
    this.rt = new RequestTarget({ getAllResults: true });

    this.rt.on('boom', () => 1);
    this.rt.on('boom', () => 3);
    this.rt.on('boom', () => 5);

    const result = this.rt.request('boom');
    expect(result).to.eql([1, 3, 5]);
  })

  it('options.getAllResults with asynchronous results and options.autoPromiseAll', async function () {
    this.rt = new RequestTarget({ getAllResults: true, autoPromiseAll: true });

    this.rt.on('boom', () => Promise.resolve(1));
    this.rt.on('boom', () => Promise.resolve(3));
    this.rt.on('boom', () => Promise.resolve(5));

    const result = await this.rt.request('boom');
    expect(result).to.eql([1, 3, 5]);
  });

  it('options.getAllResults with asynchronous results and options.autoPromiseAll as false', function () {
    this.rt = new RequestTarget({ getAllResults: true, autoPromiseAll: false });

    this.rt.on('boom', () => Promise.resolve(1));
    this.rt.on('boom', () => Promise.resolve(3));
    this.rt.on('boom', () => Promise.resolve(5));

    const result = this.rt.request('boom');
    expect(result).to.be.an('array');
    expect(result[0]).to.be.a('promise');
    expect(result[1]).to.be.a('promise');
    expect(result[2]).to.be.a('promise');
  });
});

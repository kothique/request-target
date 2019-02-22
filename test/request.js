const RequestTarget = require('../src');

describe('#request', function () {
  beforeEach(function () {
    this.rt = new RequestTarget;
  });

  it('synchronous succeeding handler', function () {
    this.rt.on('add', ({ a, b }) => a + b);

    expect(this.rt.request('add', { a: -20, b: 62 })).to.equal(42);
  });

  it('synchronous failing handler', function () {
    this.rt.on('attain enlightenment', () => { throw new Error('impossible!') });

    expect(() => this.rt.request('attain enlightenment')).to.throw();
  });

  it('asynchronous succeeding handler', function () {
    this.rt.on('categories', ({ limit = undefined }) => new Promise(resolve =>
      setTimeout(() => resolve({ videos: ['milf', 'anal', 'young', 'feet'].slice(0, limit) }))
    ));

    return expect(this.rt.request('categories', { limit: 2 })).to.eventually
      .be.an('object').and.have.property('videos')
      .which.is.an('array').and.has.ordered.members(['milf', 'anal']);
  });

  it('asynchronous failing handler', function (done) {
    this.rt.on('videos', ({ category }) => new Promise((resolve, reject) =>
      setTimeout(() => {
        if (!['milf', 'anal', 'young', 'feet'].includes(category)) {
          reject(new Error('not found'));
        }

        resolve('some stuff');
      })
    ));

    this.rt.request('videos', { category: 'trans' })
      .then(
        () => done(new Error('should have failed')),
        error => {
          expect(error).to.be.an('error')
            .and.have.property('message').equal('not found');
          done();
        }
      );
  });

  it('no handlers at all', function () {
    expect(this.rt.request('unknown subject')).to.be.undefined;
  });

  it('several handlers with no result', function () {
    this.rt.on('meow', () => {});
    this.rt.on('meow', () => {});
    this.rt.on('meow', () => {});

    const result = this.rt.request('meow');
    expect(result).to.be.undefined;
  });

  it('several handlers with successful resolution', function () {
    this.rt.on('meow', () => {});
    this.rt.on('meow', () => 'bim');
    this.rt.on('meow', () => 'bam');
    this.rt.on('meow', () => 'miss lou');
    this.rt.on('meow', () => 'mass ran');
    this.rt.on('meow', () => { throw new Error });

    const result = this.rt.request('meow');
    expect(result).to.equal('bim');
  });

  it('several handlers resolving to error', function () {
    this.rt.on('meow', () => {});
    this.rt.on('meow', () => { throw new Error('boom') });
    this.rt.on('meow', () => 'um');
    this.rt.on('meow', () => 'lang');
    this.rt.on('meow', () => 'sham');
    this.rt.on('meow', () => 'lang');
    this.rt.on('meow', () => 'pie');

    expect(() => this.rt.request('meow')).to.throw(Error, 'boom');
  });

  it('several arguments', function () {
    this.rt.on('concat', (...strs) => strs.length ? strs[0].concat(...strs.slice(1)) : '');

    const result = this.rt.request('concat', 'meow', 'bark', 'oink');
    expect(result).to.be.a('string').and.equal('meowbarkoink');
  });
});

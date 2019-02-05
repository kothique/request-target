import RequestTarget from '../src';

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

  it('asynchronous succeeding handler', async function () {
    this.rt.on('categories', ({ limit = undefined }) => new Promise(resolve =>
      setTimeout(() => resolve({ videos: ['milf', 'anal', 'young', 'feet'].slice(0, limit) }))
    ));

    const result = await this.rt.request('categories', { limit: 2 });
    expect(result).to.be.an('object').and.have.property('videos');
    expect(result.videos).to.be.an('array').and.have.ordered.members(['milf', 'anal']);
  });

  it('asynchronous failing handler', async function () {
    this.rt.on('videos', ({ category }) => new Promise((resolve, reject) =>
      setTimeout(() => {
        if (!['milf', 'anal', 'young', 'feet'].includes(category)) {
          reject(new Error('not found'));
        }

        return 'some stuff...';
      })
    ));

    try {
      await this.rt.request('videos', { category: 'trans' });
    } catch (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.be.an('string').equal('not found');
    }
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
});

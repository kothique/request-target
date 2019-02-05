import RequestTarget from '../src';

describe('#on and #off', function () {
  beforeEach(function () {
    this.rt = new RequestTarget;
  });

  it('#off after #on', function () {
    const handler = () => {};
    this.rt.on('meow', handler);

    expect(this.rt._handlers).not.to.be.empty;
    expect(this.rt._handlers.meow).to.exist.and.have.length(1);

    this.rt.off('meow', handler);
    expect(this.rt._handlers.meow).to.be.empty;
  });

  it('multiple #off\'s and #on\'s with the same handler', function () {
    const handler = () => {};
    this.rt.on('meow', handler);

    expect(this.rt._handlers).not.to.be.empty;
    expect(this.rt._handlers.meow).to.exist.and.have.length(1);

    this.rt.on('meow', handler);
    expect(this.rt._handlers.meow).to.have.length(2);

    this.rt.off('meow', handler);
    expect(this.rt._handlers.meow).to.have.length(1);

    this.rt.off('meow', handler);
    expect(this.rt._handlers.meow).to.have.length(0);
  });
});

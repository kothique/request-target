const RequestTarget = require('../src');

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

  it(`#offAll removes all handlers for a given subject`, function () {
    this.rt.on('meow', () =>{});
    this.rt.on('meow', () =>{});
    this.rt.on('meow', () =>{});

    expect(this.rt._handlers).not.to.be.empty;
    expect(this.rt._handlers.meow).to.exist.and.have.length(3);

    this.rt.offAll('meow');
    expect(this.rt._handlers.meow).not.to.exist;
  });

  it(`#offAll removes all handlers`, function () {
    this.rt.on('meow', () =>{});
    this.rt.on('bark', () =>{});
    this.rt.on('meow', () =>{});

    expect(this.rt._handlers).not.to.be.empty;
    expect(this.rt._handlers.meow).to.exist.and.have.length(2);
    expect(this.rt._handlers.bark).to.exist.and.have.length(1);

    this.rt.offAll();
    expect(this.rt._handlers).to.be.empty;
  });
});

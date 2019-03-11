const RequestTarget = require('../src');

describe('aliases', function () {
  it('#on === #addRequestHandler', function () {
    expect(RequestTarget.on).to.equal(RequestTarget.addRequestHandler);
  });

  it('#on === #addHandler', function () {
    expect(RequestTarget.on).to.equal(RequestTarget.addHandler);
  });

  it('#off === #removeRequestHandler', function () {
    expect(RequestTarget.on).to.equal(RequestTarget.removeRequestHandler);
  });

  it('#off === #removeHandler', function () {
    expect(RequestTarget.on).to.equal(RequestTarget.removeHandler);
  });

  it('#offAll === #removeAllRequestHandlers', function () {
    expect(RequestTarget.offAll).to.equal(RequestTarget.removeAllRequestHandlers);
  });

  it('#off === #removeAlltHandlers', function () {
    expect(RequestTarget.offAll).to.equal(RequestTarget.removeAllHandlers);
  });
});

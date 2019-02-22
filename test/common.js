const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');

Chai.use(ChaiAsPromised);

global.expect = Chai.expect;

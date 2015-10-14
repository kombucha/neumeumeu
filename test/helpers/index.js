var chai = require('chai');
chai.use(require('sinon-chai'));

global.requireApp = require('./requireApp');
global.expect = chai.expect;

import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import jsdom from 'jsdom';
import TestUtils from 'react-addons-test-utils';

chai.use(chaiAsPromised);

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = {userAgent: 'node.js'};
global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
global.request = supertest;
global.TestUtils = TestUtils;

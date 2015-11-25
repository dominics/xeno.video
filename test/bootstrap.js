import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import supertest from 'supertest';
import jsdom from 'jsdom';
import TestUtils from 'react-addons-test-utils';
import jquery from './../bower_components/jquery/dist/jquery';
import { logTo } from './log';

chai.use(chaiAsPromised);

sinon.xhr.supportsCORS = true;

global.logTo = logTo;
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.XMLHttpRequest = global.window.XMLHttpRequest;
global.navigator = {userAgent: 'node.js'};
global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
global.request = supertest;
global.TestUtils = TestUtils;
global.$ = jquery(global.window);

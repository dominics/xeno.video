import chai from "chai";
import sinon from "sinon";
import chaiAsPromised from "chai-as-promised";
import supertest from "supertest";
import jsdom from "jsdom";
import TestUtils from "react-dom/test-utils";
import path from "path";
import log from "../src/util/log";
import config from "../config";

chai.use(chaiAsPromised);

sinon.xhr.supportsCORS = true;

global.log = log;
global.document = jsdom.jsdom("<!doctype html><html><body></body></html>");
global.window = document.defaultView;

global.window.localStorage = {
  setItem: () => {},
  removeItem: () => {},
  key: () => {},
  getItem: () => {},
  length: 0,
};

global.XMLHttpRequest = global.window.XMLHttpRequest;
global.navigator = { userAgent: "node.js" };
global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
global.request = supertest;
global.TestUtils = TestUtils;
global.$ = jquery(global.window);

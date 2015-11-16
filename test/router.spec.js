import router from './../dist/router';
import express from 'express';

describe('module router', () => {
  it('is a constructor function', () => {
    expect(router).to.be.a('function');
  });

  describe('instance', function() {
    before(() => {
      this.sut = deps.container.router;
    });

    it('is an instance of express.Router', () => {
      expect(this.sut).itself.to.respondTo('use').and.respondTo('get');
    });
  });
});

import app from './../dist/app';
import deps from './../dist/deps';
import express from 'express';

describe('module app', function() {
  this.sut = null;

  before(() => {
    this.sut = deps.container.app;
  });

  it('is an express instance', () => {
    expect(this.sut).itself.to.respondTo('use');
  });
});
//

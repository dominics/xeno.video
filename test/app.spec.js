import deps from './../dist/deps';
import config from './../dist/config';

describe('module app', function() {
  this.sut = null;

  before(() => {
    this.sut = deps(config()).container.app;
  });

  it('is an express instance', () => {
    expect(this.sut).itself.to.respondTo('use');
  });
});
//

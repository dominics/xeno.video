import deps from './../src/deps';
import config from './../src/config';

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

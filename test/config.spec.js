import config from './../dist/config';

describe('module config', () => {
  it('is a constructor function', () => {
    expect(config).to.be.a('function');
  });
  it('returns an object, which is the resolved config');
});

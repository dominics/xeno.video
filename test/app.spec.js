import app from './../dist/app';

describe('module app', () => {
  it('is reentrant', (done) => {
    app();
    app();
    done();
  });
});

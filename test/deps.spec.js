import deps from './../dist/deps';

describe('module deps', () => {
  it('is a constructor function for a DI container', () => {
    expect(deps).to.be.a('function');
    expect(deps()).to
      .be.a('object')
      .and.respondTo('service');
  });
});
//

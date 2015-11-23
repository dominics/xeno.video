import { default as passport, validate } from './../dist/passport';

describe('module passport', () => {
  describe('export default()', () => {
    it('is a passport object constructor', () => {
      expect(passport).to.be.a('function');
    });
  });

  describe('export validate()', () => {
    it('is a validation method', () => {
      expect(validate).to.be.a('function');
    });
  });
});

import { default as passport, validate } from './../dist/passport';

describe('module passport', () => {
  describe('export default()', () => {
    it('is a passport object constructor', () => {
      expect(passport).to.be.a('function');
    });
  });


});

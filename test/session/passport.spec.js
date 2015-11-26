import passport from './../../dist/session/passport';

describe('session module passport', () => {
  describe('export default()', () => {
    it('is a passport object constructor', () => {
      expect(passport).to.be.a('function');
    });
  });
});

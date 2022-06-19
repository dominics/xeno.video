import passport from './../../src/session/passport';

describe('session module passport', () => {
  describe('export default()', () => {
    it('is a passport object constructor', () => {
      expect(passport).toBeInstanceOf(Function);
    });
  });
});

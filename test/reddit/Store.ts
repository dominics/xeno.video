export default (store) => {
  describe(`store (${store.type || 'unknown'}) abstract`, () => {
    it('has a type that is not undefined', () => {
      expect(store.type).to.be.a('string').and.not.eql('unknown');
    });

    it('can prepare a redis list at a given key', () => {
      expect(store).respondsTo('prepareList');
    });
  });
};

export function queue() {
  const process = sinon.stub();
  const add = sinon.stub();

  return {
    process,
    add,
  };
}

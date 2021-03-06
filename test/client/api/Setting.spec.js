import Setting from './../../../dist/client/api/Setting';

describe('client api class Setting', function() {
  before(() => {
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = true;

    global.XMLHttpRequest = this.server.xhr;

    this.server.respondWith('/api/setting/all', [
      200,
      { 'Content-Type': 'application/json' },
      '{"type": "setting", "data": [{ "id": "foo", "value": true }]}',
    ]);

    this.setting = new Setting();
  });

  after(() => { //
    this.server.restore();
  });

  describe('.refresh()', () => {
    it('responds', () => {
      expect(this.setting).to.respondTo('refresh');
    });

    it('eventually returns a map of settings', () => {
      return expect(this.setting.refresh())
        .to.eventually.be.instanceOf(Array);
    });
  });
});

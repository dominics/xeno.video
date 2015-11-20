import Setting from './../../../dist/client/api/Setting';
import { Map } from 'immutable';

describe('client api class Setting', function() {
  before(() => {
    this.server = sinon.fakeServer.create();

    this.server.respondWith('/setting/all', [
      200,
      { 'Content-Type': 'application/json' },
      '[{ "id": "foo", "value": true }]',
    ]);

    this.setting = new Setting();
  });

  after(() => {
    this.server.restore();
  });

  describe('.refresh()', () => {
    it('responds', () => {
      expect(this.setting).to.respondTo('refresh');
    });

    it('eventually returns a map of settings', () => {
      return expect(this.setting.refresh())
        .to.eventually.be.an.instanceOf(Map);
    });
  });
});

import { Map } from "immutable";
import _ from "lodash";

export default class SettingStore {
  getAll(req) {
    return new Map({
      authenticated: req.isAuthenticated(),
      nsfw: _.get(req, "session.setting.nsfw", false),
      autoplay: _.get(req, "session.setting.autoplay", true),
      userId: _.get(req, "session.passport.user.reddit.id", null),
      name: _.get(req, "session.passport.user.reddit.name", null),
    })
      .map((v, k) => ({ id: k, value: v }))
      .toArray();
  }

  update(req) {
    const items = req.body.data;

    if (typeof req.session.setting === "undefined") {
      req.session.setting = {};
    }

    for (const item of items) {
      req.session.setting[item.id] = item.value;
    }

    return this.getAll(req);
  }
}

import libdebug from "debug";
import Api from "./Api";
import SettingValue from "../setting/Setting";

const debug = libdebug("xeno:api:setting");

export default class Setting extends Api {
  refresh() {
    debug("Getting settings from API");
    return this.get("/api/setting/all").then(this._toValueObjects);
  }

  update(data) {
    debug("Updating settings via API", data);
    return this.patch("/api/setting", {
      type: "setting",
      data,
    }).then(this._toValueObjects);
  }

  _toValueObjects(data) {
    return Promise.resolve(
      data.map((setting) => new SettingValue(setting.id, setting.value))
    );
  }
}

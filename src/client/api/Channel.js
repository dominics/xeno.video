import libdebug from "debug";
import Api from "./Api";

const debug = libdebug("xeno:api:channel");

export default class Channel extends Api {
  refresh() {
    debug("Refreshing Channel via API");
    return this.get("/api/channel/all");
  }
}

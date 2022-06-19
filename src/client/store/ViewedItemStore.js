import { MapStore } from "flux/utils";
import libdebug from "debug";
import types from "../action/types";

const debug = libdebug("xeno:store:viewedItem");

export default class ViewedItemStore extends MapStore {
  reduce(state, action) {
    switch (action.type) {
      case types.viewStart:
        debug("Received view start in viewed item store");
        return state;
      case types.viewEnd:
        debug("Received view end in viewed item store");
        return state;
      default:
        return state;
    }
  }
}

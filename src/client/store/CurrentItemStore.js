import libdebug from "debug";
import { ReduceStore } from "flux/utils";
import _ from "lodash";
import types from "../action/types";

const debug = libdebug("xeno:store:currentItem");

export default class CurrentItemStore extends ReduceStore {
  getInitialState() {
    return null;
  }

  reduce(state, action) {
    switch (action.type) {
      case types.itemSelect:
        return action.isError() ? null : action.data;
      case types.channelSelected:
        if (state !== null) {
          return state;
        }

        return _.get(action.data, "items[0].id", null);
      default:
        return state;
    }
  }
}

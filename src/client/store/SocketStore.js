import { MapStore } from "flux/utils";
import libdebug from "debug";
import io from "../io";
import types from "../action/types";

const debug = libdebug("xeno:store:socket");

export default class SocketStore extends MapStore {
  io = null;

  constructor(dispatcher) {
    super(dispatcher);
  }

  connect() {
    this.io = io();

    debug("Emitting HELO");
    this.io.emit("helo", navigator.userAgent);

    this.io.on("tv", (m) => {
      debug("Received message on TV channel", m);
    });
  }

  reduce(state, action) {
    switch (action.type) {
      case types.initialize:
        this.connect();
        return state;
      default:
        return state;
    }
  }
}

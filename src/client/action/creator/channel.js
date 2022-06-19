import libdebug from "debug";
import _ from "lodash";
import types from "../types";

const debug = libdebug("xeno:actions:channel");

export default (registry, api, store) => {
  // On initialize action, receive channels and select the first one
  registry.wrap(
    types.initialize,
    (previous, err = null, originalData = null) => {
      if (err) {
        return previous(err);
      }

      if (!store.currentChannel.hasChannel()) {
        const first = store.favouriteChannel.getState().first();
        debug("Dispatching to channelSelect because no current channel", first);
        registry.getCreator(types.channelSelect)(null, first);
      }

      const getChannels = api.channel
        .refresh()
        .then((data) => {
          debug("Got channel data", data);
          return Promise.resolve(
            registry.getCreator(types.channelReceive)(null, data)
          );
        })
        .catch((e) => {
          debug("Got error receiving channels", e);
          registry.getCreator(types.channelReceive)(e);
          return Promise.reject(e);
        });

      return previous(err, originalData);
    }
  );

  // On selecting a channel, refresh items in channel
  registry.wrap(
    types.channelSelect,
    (previous, err = null, channelId = null) => {
      if (err) {
        return previous(err);
      }

      debug("Beginning channel selection", channelId);
      api.item
        .getAllForChannel(channelId)
        .then((data) => {
          debug("Dispatching channelSelected with", channelId, data);
          return registry.getCreator(types.channelSelected)(null, {
            items: data,
            channelId,
          });
        })
        .catch((e) => {
          debug("Error getting all items for channel", channelId, e);
          return registry.getCreator(types.channelSelected)(e);
        });

      debug("Dispatching channelSelect");

      return previous(err, channelId);
    }
  );

  registry.wrap(types.channelAdd, (previous, err = null, channel = null) => {
    if (err) {
      return previous(err);
    }

    debug("Adding channel, kicking off channel selection too", channel);
    registry.getCreator(types.channelSelect)(null, channel);

    return previous(err, channel);
  });
};

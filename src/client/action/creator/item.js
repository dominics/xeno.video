import types from './../types';
import libdebug from 'debug';
import {build as fragment} from './../../fragment';

const debug = libdebug('xeno:actions:item');

export default (registry, api, store) => {
  registry.wrap(types.itemSelect, (previous, err = null, itemId = null) => {
    if (err || !itemId) {
      return previous(err, itemId);
    }

    const item = $('#item-' + itemId);
    const channelId = store.currentChannel.latest();

    if (channelId) {
      // Hackity
      window.ignoreHashChange = true;
      window.location = '#' + fragment(channelId, itemId);
      window.ignoreHashChange = false;
    }

    if (item.eq(0) && item.offset()) {
      if ($(window).width() > 768) { // 768 is scss $screen-sm-min
        // @todo: iff bottom of item is below viewport, scroll until it's somewhere in the upper quarter (lax-follow)
        window.scrollTo(item.offset().left, item.offset().top - 200);
      } else {
        window.scrollTo(0, 0);
      }
    }

    return previous(err, itemId);
  });
};

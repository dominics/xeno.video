import types from './../types';
import libdebug from 'debug';

const debug = libdebug('xeno:actions:item');

export default (registry, api, store) => {
  registry.wrap(types.itemSelect, (previous, err = null, itemId = null) => {
    if (err || !itemId) {
      return previous(err, itemId);
    }

    const item = $('#item-' + itemId);

    // @todo: iff bottom of item is below viewport, scroll until it's somewhere in the upper quarter (lax-follow)

    if (item.eq(0)) {
      window.scrollTo(item.offset().left, item.offset().top - 200);
    }

    return previous(err, itemId);
  });
};

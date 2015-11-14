import types from './../types';
import libdebug from 'debug';

const debug = libdebug('xeno:actions:item');

export default (registry, _api, _store) => {
  registry.wrap(types.itemSelect, (previous, err = null, itemId = null) => {
    if (err || !itemId) {
      return previous(err, itemId);
    }

    const item = $('#item-' + itemId);

    if (item.eq(0)) {
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

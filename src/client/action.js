import libdebug from 'debug';
import activeDispatcher from './dispatcher';
import api from './api';
import store from './store';

import types from './action/types';
import Registry from './action/Registry';
import creators from './action/creators';

const debug = libdebug('xeno:actions');

const registry = new Registry(activeDispatcher, types);

for (const creator of Object.keys(creators)) {
  creators[creator](registry, api, store);
}

export default registry;

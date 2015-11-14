import libdebug from 'debug';
import dispatcher from './dispatcher';

const debug = libdebug('xeno:actions');

const actions = {
  selectItem:    true,
  selectChannel: true,
  updateSetting: true,
  viewStart:     true,
  viewEnd:       true,
};

const types = Object.keys(actions);

function payload(type, data) {
  return {
    type: type,
    data: data,
    created: Date.now() / 1000,
  };
}

function _dispatch(action) {
  debug('Dispatching action', action);
  return dispatcher.dispatch(action);
}

function creator(type) {
  return (data, dispatch = true) => {
    debug('Creating action', type, data);
    const action = payload(type, data);

    if (dispatch) {
      return _dispatch(action);
    }

    return action;
  };
}

const creators = {};
types.forEach((type) => {
  creators[type] = creator(type);
});

export { actions as default, actions, types, payload, creator, creators };

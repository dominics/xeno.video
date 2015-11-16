import libdebug from 'debug';
import Bottle from 'bottlejs';
import socket from 'socket.io';

import config from './config';
import app from './app';
import emitter from './emitter';
import server from './server';
import passport from './passport';
import router from './router';
import redis from './redis';

import Api from './reddit/Api';

import storeChannel from './reddit/ChannelStore';
import storeItem from './reddit/ItemStore';
import storeSetting from './setting/SettingStore';

import routeIndex from './routes/index';
import routeUser from './routes/user';
import routeApi from './routes/api';
import routeError from './routes/error';

const debug = libdebug('xeno:deps');

const deps = Bottle.pop('main');

deps.service('config', config);

deps.service('api', Api, 'config');
deps.service('redis', redis, 'config');
deps.service('app', app, 'config');

deps.service('server', server, 'config', 'app');
deps.service('passport', passport, 'config', 'app', 'io', 'redis');

deps.service('io', socket, 'server');

deps.service('emitter', emitter, 'config', 'io');

deps.service('store.channel', storeChannel, 'api', 'redis');
deps.service('store.item', storeItem, 'api', 'redis');
deps.service('store.setting', storeSetting, 'api', 'redis');

deps.service('route.index', routeIndex, 'router.main');
deps.service('route.api', routeApi, 'router.main', 'store');
deps.service('route.user', routeUser, 'router.main', 'passport');
deps.service('route.error', routeError, 'router.main');

deps.service('router.root', router, 'route');

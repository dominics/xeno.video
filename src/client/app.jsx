// Event handler
const io = require('./io');
const React = require('react/addons');

import Container from './ui/Container.jsx';
import ItemStore from './store/ItemStore.js';
import ChannelStore from './store/ChannelStore.js';
import SettingStore from './store/SettingStore.js';

window.dbg = require('debug');

document.addEventListener('DOMContentLoaded', () => {
  const ioClient = io();

  const stores = {
    item:    new ItemStore(),
    channel: new ChannelStore(),
    setting: new SettingStore(),
  };

  React.render(
    window._tv = <Container socket={ioClient} stores={stores} />,
    document.getElementById('tv')
  );
});

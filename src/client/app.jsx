// Event handler
const io   = require('./io');
const React     = require('react/addons');
import Container from './ui/Container.jsx';
import ItemStore from './store/ItemStore.js';
import ChannelStore from './store/ChannelStore.js';

window.dbg = require('debug');

document.addEventListener('DOMContentLoaded', () => {
  const ioClient = io();

  const stores = {
    item:    new ItemStore(),
    channel: new ChannelStore(),
  };

  React.render(
    <Container socket={ioClient} stores={stores} />,
    document.getElementById('tv')
  );
});

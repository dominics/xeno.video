// Event handler
const io   = require('./io');
const React     = require('react/addons');
const Container = require('./ui/Container.jsx');
const ItemStore = require('./store/ItemStore.js');
const ChannelStore = require('./store/ChannelStore.js');

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

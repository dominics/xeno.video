// Event handler
const io   = require('./io');
const React     = require('react/addons');
const Container = require('./ui/Container.jsx');

window.dbg = require('debug');

document.addEventListener('DOMContentLoaded', () => {
  React.render(
    <Container url="/config" io={io} />,
    document.getElementById('tv')
  );
});

import React from 'react/addons';
import Container from './component/Container';

window.dbg = require('debug');

document.addEventListener('DOMContentLoaded', () => {
  React.render(
    window._tv = <Container />,
    document.getElementById('tv')
  );
});

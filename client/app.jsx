// Event handler
var handler = require('./handler');
var React = require('react');
var Container = require('./ui/Container.jsx');

document.addEventListener('DOMContentLoaded', function() {
    handler();

    console.log('ui started');

    React.render(
        <Container />,
        document.getElementById('tv')
    );
});

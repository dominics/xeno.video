'use strict';

var React = require('react');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            start: new Date()
        };
    },

    render: function () {
        return (
            <div id="viewer">
            </div>
        );
    }
});
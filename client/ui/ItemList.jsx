"use strict";

var React = require('react');
var Item  = require('./Item.jsx');

module.exports = React.createClass({
    propTypes: {
        children: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Item))
    },

    getInitialState: function () {
        return {
            children: []
        };
    },

    render: function () {
        return (
            <ol class="item-list">
                {this.state.children}
            </ol>
        )
    }
});
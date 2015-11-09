var React = require('react');

module.exports = React.createClass({
    propTypes: {
        id:  React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired
    },

    render: function () {
        return (
            <li class="item" id={"item-" + this.state.id}>{this.state.url}</li>
        )
    }
});
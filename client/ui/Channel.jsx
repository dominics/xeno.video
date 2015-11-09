var React = require('react');

module.exports = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            <div class="channel" id={"channel-" + this.props.name}>
                <code>{this.state}</code>
            </div>
        )
    }
});
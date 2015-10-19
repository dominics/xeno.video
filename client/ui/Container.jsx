var React = require('react');

var ChannelList = require('./ChannelList.jsx');
var ItemList = require('./ItemList.jsx');
var Viewer = require('./Viewer.jsx');

module.exports = React.createClass({
    render: function() {
        return (
            <div id="container">
                <ChannelList />
                <ItemList />
                <Viewer />
            </div>
        )
    }
});
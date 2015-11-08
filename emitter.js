module.exports = function(app) {
    console.log('Within emitter');
    app.locals.io.emit('tv', 'Hello, world');
};

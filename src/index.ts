import debug from 'debug'
import getConfig from './config'
import deps from './deps'

const config = getConfig()

 // This must be the first use of 'debug' (after config is loaded)
debug("xeno:main")("Starting xeno.video");

const { container } = deps(config);

const {emitter} = container;
emitter.emit("Hello!");

const {server} = container;
server.listen(container.config.PORT);

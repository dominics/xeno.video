import Queue from "bull";

export default (config) => (name) => Queue(name, config.REDIS_PORT, config.REDIS_HOST);

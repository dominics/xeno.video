import { createClient } from "redis";
import libdebug from "debug";
import {Config} from "./config";

const debug = libdebug("xeno:redis");

export default (config: Config) => {
  const client = createClient({
    socket: {
      port: parseInt(config.REDIS_PORT ?? '', 10) || 6379,
      host: config.REDIS_HOST ?? 'localhost',
    }
  });

  client.on("error", (err) => {
    debug(err);
  });

  return client;
};


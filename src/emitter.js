import _ from "lodash";
import libdebug from "debug";

const debug = libdebug("xeno:emitter");

export default (config, socket, sessionInstance) => {
  socket.on("connection", (connection) => {
    if (!_.get(connection, "request.session.passport.user.id", false)) {
      debug("Unauthenticated Socket.io client has been disconnected");
      connection.disconnect();
      return;
    }

    debug("A client connected");
  });

  socket.on("helo", (req) => {
    debug("Helo received", req);
  });

  socket.use((connection, next) => {
    sessionInstance(connection.request, connection.request.res, next);
  });

  return socket;
};

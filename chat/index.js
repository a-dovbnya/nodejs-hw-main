let users = {};

module.exports = io => {
  io.on("connection", socket => {
    let user = {
      username: socket.handshake.headers.username,
      id: socket.id
    };

    users[socket.id] = user;

    socket.emit("all users", users);
    socket.broadcast.emit("new user", user);

    socket.on("chat message", (message, id) => {
      socket.to(id).emit("chat message", message, socket.id);
    });

    socket.on("disconnect", () => {
      delete users[socket.id];
      socket.broadcast.emit("delete user", socket.id);
    });
  });
};

import { Server } from "socket.io";
import fs from "fs";

const root_directory = "/Users/mac/shared";

const server = new Server(18953);

console.log("Started websocket server on port 18953");

server.on("connection", function(socket) {
  console.log(`Initializing key for new connection from ${socket.conn.remoteAddress}`);
  const key = Math.floor(Math.random() * 100000);
  socket.emit("INIT", key.toString());

  socket.on("RECV", function(recv_key) {
    if (recv_key == this[1]) {
      console.log(`Successfully recieved connected to ${this[0].conn.remoteAddress}`);
    } else {
      this[0].disconnect();
    };
  }.bind([socket, key]));

  socket.on("disconnect", function() {
    console.log(`${this.conn.remoteAddress} disconnected`);
  }.bind(socket));

  socket.on("GET", function(request) {
    let path = root_directory + request;
    if (fs.existsSync(path)) {
      if (fs.statSync(path).isDirectory()) {
        let files = {};
        for (let x of fs.readdirSync(path)) {
          files[x] = {
            "directory": fs.statSync((path.endsWith("/") ? path : path + "/") + x).isDirectory()
          };
        };
        console.log(JSON.stringify(files));
        socket.emit("LIST", JSON.stringify(files));
      };
    };
  });
});

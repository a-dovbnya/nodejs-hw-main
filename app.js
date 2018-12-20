const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io").listen(server);

const router = require("./routes/api/v1.0/");
const chat = require("./chat");

chat(io);

app.use(cookieParser());

app.use(express.json({ type: "text/plain" }));
app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./models");
require("./config/config-passport");

app.use("/", router);
app.use((req, res, next) => {
  if (req.method === "GET") {
    res.sendFile(path.join(__dirname, "dist/index.html"));
  }
});

app.use((req, res, next) => {
  res.status(404).json({ err: "404", message: "Use api on routes /api/v1.0/" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ err: "500", message: err.message });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  server.listen(PORT, function() {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
} else {
  module.exports = server;
}

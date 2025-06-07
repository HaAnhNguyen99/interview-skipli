require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const employeeRoutes = require("./routes/employeeRoutes");
const messageRoutes = require("./routes/messageRoutes");
const taskRoutes = require("./routes/taskRoutes");
const http = require("http");
const socketio = require("socket.io");
const db = require("./services/firebaseService");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", employeeRoutes);
app.use("/api", messageRoutes);
app.use("/api", taskRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    if (!onlineUsers[userId]) onlineUsers[userId] = [];

    onlineUsers[userId].push(socket.id);

    console.log("Joined:", onlineUsers);
  });

  socket.on("send_message", async (data) => {
    console.log("Send message:", data);
    const { from, to, content } = data;
    const newMsgRef = db.collection("messages").doc();
    const msgObj = {
      from,
      to,
      content,
      timestamp: Date.now(),
      read: false,
    };
    await newMsgRef.set(msgObj);

    if (onlineUsers[to]) {
      console.log("send to:", onlineUsers[to]);
      io.to(onlineUsers[to]).emit("receive_message", {
        ...msgObj,
        id: newMsgRef.id,
      });
    }
    if (onlineUsers[from]) {
      console.log("send from:", onlineUsers[from]);
      io.to(onlineUsers[from]).emit("receive_message", {
        ...msgObj,
        id: newMsgRef.id,
      });
    }
  });

  socket.on("disconnect", () => {
    Object.keys(onlineUsers).forEach((key) => {
      if (onlineUsers[key] === socket.id) delete onlineUsers[key];
    });
    console.log("User disconnected:", socket.id);
    console.log("Online users:", onlineUsers);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

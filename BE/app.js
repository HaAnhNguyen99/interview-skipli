require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const employeeRoutes = require("./routes/employeeRoutes");
const taskRoutes = require("./routes/taskRoutes");
const http = require("http");
const socketio = require("socket.io");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", employeeRoutes);
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
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  // Nhận và gửi message real-time
  socket.on("send_message", async (data) => {
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
      io.to(onlineUsers[to]).emit("receive_message", {
        ...msgObj,
        id: newMsgRef.id,
      });
    }
    if (onlineUsers[from]) {
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
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

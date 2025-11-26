const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const http = require("http");

const { authSocket, socketServer } = require("./socketServer");
const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const messages = require("./routes/messages");

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// ------------------- SOCKET.IO -------------------
const io = require("socket.io")(httpServer, {
  cors: {
    origin: [
      "https://full-stack-social-media-app-view.vercel.app",
      "https://post-it-heroku.herokuapp.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));

// ------------------- DATABASE CONNECTION -------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// ------------------- MIDDLEWARE -------------------
app.use(cors({
  origin: [
    "https://full-stack-social-media-app-view.vercel.app",
    "https://post-it-heroku.herokuapp.com"
  ],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------- REQUEST LOGGING -------------------
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// ------------------- API ROUTES -------------------
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/messages", messages);

// ------------------- ROOT ROUTE -------------------
app.get("/", (req, res) => {
  res.json({
    message: "Server is running!",
    endpoints: {
      posts: "/api/posts",
      users: "/api/users",
      comments: "/api/comments"
    }
  });
});

// ------------------- 404 HANDLER -------------------
app.all("*", (req, res) => {
  console.log(`404: Route not found - ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    url: req.originalUrl,
    availableEndpoints: [
      "GET /api/posts",
      "POST /api/posts",
      "GET /api/posts/:id",
      "PATCH /api/posts/:id",
      "DELETE /api/posts/:id"
    ]
  });
});

// ------------------- PRODUCTION -------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
}

// ------------------- ERROR HANDLER -------------------
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test API: http://localhost:${PORT}/api/posts`);
});

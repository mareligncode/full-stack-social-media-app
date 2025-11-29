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

// ------------------- 1. CONFIGURATION -------------------
// Add all your Vercel URLs here. 
// ⚠️ IMPORTANT: No trailing slash "/" at the end of URLs!
const allowedOrigins = [
  "https://full-stack-social-media-app-view.vercel.app",
  "https://full-stack-social-media-app-three.vercel.app", // The one you mentioned
  "http://localhost:3000" // For local testing
];

// ------------------- 2. SOCKET.IO SETUP -------------------
const io = require("socket.io")(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));

// ------------------- 3. DATABASE CONNECTION -------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// ------------------- 4. MIDDLEWARE -------------------
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------- 5. REQUEST LOGGING -------------------
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ------------------- 6. API ROUTES -------------------
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/messages", messages);

// ------------------- 7. ROOT ROUTE (Health Check) -------------------
app.get("/", (req, res) => {
  res.json({ message: "Render Backend is Running!" });
});

// ------------------- 8. START SERVER -------------------
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
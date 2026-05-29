import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import likeroutes from "./routes/like.js";
import dislikeroutes from "./routes/dislike.js";
import watchlaterroutes from "./routes/watchlater.js";
import historyroutes from "./routes/history.js";
import commentRoutes from "./routes/comment.js";
import { initSocket } from "./socket.js";

dotenv.config();
const app = express();
import Path from "path";
mongoose.set('bufferCommands', false);

app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/upload", express.static(Path.join("uploads")));

app.get("/", (req, res) => {
  res.send("Youtube Backend Is Working");
});
app.use(bodyParser.json());
app.use("/user", userroutes);
app.use("/like", likeroutes);
app.use("/dislike", dislikeroutes);
app.use("/watchlater", watchlaterroutes);
app.use("/history", historyroutes);
app.use("/comment", commentRoutes);

const PORT = process.env.PORT || 5000;

const serverInstance = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize Socket.IO for real-time features
try {
  const io = initSocket(serverInstance, { corsOrigin: process.env.CLIENT_ORIGIN });
  io.on("error", (err) => console.error("Socket.IO error:", err));
} catch (e) {
  console.warn("Could not initialize Socket.IO:", e?.message || e);
}
const DBURL = process.env.DB_URL;

if (!DBURL) {
  console.warn("⚠️  DB_URL not configured. Set DB_URL in .env file.");
  console.warn("   Running in development mode without database.");
} else {
  mongoose
    .connect(DBURL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .then(() => {
      console.log("✓ MongoDB Connected");
    })
    .catch(async (error) => {
      console.error("✗ MongoDB Connection Error:", error.message);
      console.log("   Starting fallback in-memory MongoDB...");
      try {
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        console.log("✓ Fallback in-memory MongoDB Connected! API calls will now work.");
      } catch (memError) {
        console.error("✗ Fallback MongoDB Failed:", memError.message);
      }
    });
}

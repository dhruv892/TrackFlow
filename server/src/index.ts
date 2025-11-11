import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/api/health", (req, res) => {
  res.json({ message: "TrackFlow API is running!" });
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`🚀 TrackFlow server running on port ${PORT}`);
});

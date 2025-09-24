import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.json({ message: "TrackFlow API is running!" });
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`🚀 TrackFlow server running on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "TrackFlow API is running!" });
});

app.listen(PORT, () => {
  console.log(`🚀 TrackFlow server running on port ${PORT}`);
});

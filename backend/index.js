import 'dotenv/config'
import express from "express";
import cors from "cors";
import connectDB from './config/db.js';
import workerRoute from './routes/worker.route.js'

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use("/api/worker", workerRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




import 'dotenv/config'
import express from "express";
import cors from "cors";
import connectDB from './config/db.js';
import workerRoute from './routes/worker.route.js'
import userRoutes from './routes/userRoutes.js'
import requestRoutes from "./routes/requestRoutes.js";
import assignRoutes from "./routes/assignRoutes.js";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/test", (req, res) => {
  res.send("Backend Working");
});

app.use("/api/worker", workerRoute);
app.use("/api/assign", assignRoutes);
app.use("/api/user", userRoutes);
app.use("/api/request", requestRoutes);
app.post("/api/sms", (req, res) => {

  const { sender, message } = req.body;

  console.log("\nSMS RECEIVED");
  console.log("Sender:", sender);
  console.log("Message:", message);
  console.log("\n");

  res.status(200).json({
    success: true,
  });

});

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
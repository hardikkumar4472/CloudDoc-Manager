import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import cron from "node-cron";
import * as lifecycleService from "./services/lifecycle.service.js";
import fs from "fs";
import path from "path";
dotenv.config();



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  
  // Ensure logs directory exists and write a startup log for volume testing
  const logDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const logPath = path.join(logDir, "startup.log");
  fs.appendFileSync(logPath, `[${new Date().toISOString()}] Server started on port ${PORT}\n`);
});

// Run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("[Cron] Starting daily document lifecycle cleanup...");
  lifecycleService.cleanupExpiredDocuments();
  lifecycleService.cleanupTrash();
});

// Run once on startup for safety
setTimeout(() => {
  lifecycleService.cleanupExpiredDocuments();
  lifecycleService.cleanupTrash();
}, 5000);

// Trigger restart

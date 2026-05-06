
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import docRoutes from "./routes/doc.routes.js";
const app = express();
app.use(cors({
  origin: [
    "https://clouddoc-manager-interface.onrender.com",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);

export default app;

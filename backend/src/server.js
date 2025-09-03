import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import cors from "cors";
dotenv.config();
app.use(cors({
  origin: [
    "https://clouddoc-manager-interface.onrender.com", 
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

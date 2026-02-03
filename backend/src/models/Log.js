import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    action: { type: String, required: true }, // e.g., "VIEW", "DOWNLOAD", "SHARE", "DELETE"
    details: { type: String },
    ip: { type: String },
    userAgent: { type: String },
}, { timestamps: true });

export default mongoose.model("Log", logSchema);

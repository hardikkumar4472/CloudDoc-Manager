import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true }, 
    public_id: { type: String, required: true }, 
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isFavorite: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    textContent: { type: String },

    size: { type: Number },   
    type: { type: String },   

    shareToken: { type: String, default: null },
    shareExpiry: { type: Date, default: null },
    isVault: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null },
    
    // AI & Advanced Processing
    summary: { type: String },
    tags: [{ type: String }],
    ocrText: { type: String },
    
    // Recycle Bin
    isTrashed: { type: Boolean, default: false },
    trashedAt: { type: Date },
  },
  { timestamps: true } 
);
documentSchema.index({ filename: "text", textContent: "text" });

export default mongoose.model("Document", documentSchema);

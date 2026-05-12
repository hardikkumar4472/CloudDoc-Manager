import { createClient } from "@supabase/supabase-js";
import Document from "../models/Document.js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const cleanupExpiredDocuments = async () => {
  try {
    const expiredDocs = await Document.find({
      expiresAt: { $ne: null, $lt: new Date() }
    });

    if (expiredDocs.length === 0) return;

    console.log(`[Lifecycle] Found ${expiredDocs.length} expired documents.`);

    for (const doc of expiredDocs) {
      await deleteFileResources(doc);
    }
  } catch (err) {
    console.error("[Lifecycle] Expired cleanup failed:", err);
  }
};

export const cleanupTrash = async () => {
  try {
    // Permanently delete files trashed more than 30 days ago
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const trashDocs = await Document.find({
      isTrashed: true,
      trashedAt: { $lt: thirtyDaysAgo }
    });

    if (trashDocs.length === 0) return;

    console.log(`[Lifecycle] Emptying trash for ${trashDocs.length} documents.`);

    for (const doc of trashDocs) {
      await deleteFileResources(doc);
    }
  } catch (err) {
    console.error("[Lifecycle] Trash cleanup failed:", err);
  }
};

async function deleteFileResources(doc) {
  try {
    // 1. Delete from Supabase Storage
    const { error } = await supabase.storage
      .from("documents")
      .remove([doc.public_id]);

    if (error) {
      console.error(`[Lifecycle] Failed to delete from storage: ${doc.public_id}`, error);
    }

    // 2. Delete from MongoDB
    await Document.deleteOne({ _id: doc._id });
    console.log(`[Lifecycle] Successfully deleted ${doc.filename}`);
  } catch (err) {
    console.error(`[Lifecycle] Error deleting document ${doc._id}:`, err);
  }
}

import mongoose, { Schema } from "mongoose";

const VaultSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    type: { type: String, enum: ["youtube", "x", "notion", "linkedin", "instagram", "github", "other"], required: true },
    customType: { type: String }, // For 'other' type
    tags: { type: [String], default: [], validate: [(v: string[]) => v.length <= 5, "Max 5 tags allowed"] },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true
});

VaultSchema.index({ userId: 1, url: 1 }, { unique: true });

export const Vault = mongoose.model("Vault", VaultSchema);
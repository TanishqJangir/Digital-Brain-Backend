import mongoose, { Schema } from "mongoose";
import { lowercase } from "zod";

const TagSchema = new Schema({
    tag: { type: String, required: true, trim: true, lowercase: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true
});

TagSchema.index({ userId: 1, tag: 1 }, { unique: true });

export const Tag = mongoose.model("Tag", TagSchema);
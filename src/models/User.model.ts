import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, enum: ["local", "google", "github"], default: "local" },
    providerId: { type: String },
    avatar: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    shareLink: { type: String },
    shareLinkExpiry: { type: Date },
}, {
    timestamps: true
});

UserSchema.index(
  { shareLink: 1 },
  { unique: true, partialFilterExpression: { shareLink: { $exists: true } } }
);

export const User = mongoose.model("User", UserSchema);
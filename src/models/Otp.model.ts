import mongoose, { Schema } from "mongoose";

const OtpSchema = new Schema({
    otp: { type: String, required: true },
    email: { type: String, required: true },
    otpExpiry: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
}, {
    timestamps: true
})

OtpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model("Otp", OtpSchema);

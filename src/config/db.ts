import mongoose from "mongoose";
import dotenv from "dotenv";
import { env } from "./env";
dotenv.config();

export const connectDB = async (): Promise<void> => {
    try {

        await mongoose.connect(env.MONGODB_URL as string);
        console.log("Connected to MongoDB");

    } catch (error) {

        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);

    }
};
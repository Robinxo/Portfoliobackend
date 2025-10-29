import mongoose from "mongoose";
import "dotenv/config";

const DATABASE = process.env.DATABASE;

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(`${DATABASE}`, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    });
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
};

export default connectDB;

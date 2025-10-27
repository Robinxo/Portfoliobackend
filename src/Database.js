import mongoose from "mongoose";
import "dotenv/config";

const DATABASE = process.env.DATABASE;

const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(`${DATABASE}`);
    console.log(`MongoDB connected: ${connectInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
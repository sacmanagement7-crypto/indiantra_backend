import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/swadesh');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
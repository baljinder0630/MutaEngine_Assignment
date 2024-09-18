import mongoose from "mongoose";

const connectDB = async () => {
    try {

        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGODB_URI)
        console.log("Mongo connected");

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB
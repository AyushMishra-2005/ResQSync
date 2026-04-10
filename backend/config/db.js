import mongoose from "mongoose";
const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
    try{
        await mongoose.connect(MONGODB_URL);
        console.log("MongoDB connected");
    }catch(err){
        console.log("Database connection error. ", err);
        process.exit(1);
    }
}


export default connectDB;

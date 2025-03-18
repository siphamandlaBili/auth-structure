import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export const dbConnect = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("conncted to db");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
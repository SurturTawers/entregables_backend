import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const init = async () =>{
    try {
        const URI = process.env.MONGODB_URI;
        await mongoose.connect(URI);
        console.log("DB connected");
    } catch (error) {
        console.error("Error connecting to db", error);
    }
};
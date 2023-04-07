import mongoose from 'mongoose';
export const init = async () =>{
    try {
        const URI = process.env.MONGODB_URI;
        await mongoose.connect(URI);
        console.log("DB connected");
    } catch (error) {
        console.error("Error connecting to db", error);
    }
};
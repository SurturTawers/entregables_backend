import mongoose from 'mongoose';
import config from '../config/config';

export const init = async () =>{
    try {
        const URI = config.mongoUrl;
        await mongoose.connect(URI);
        console.log("DB connected");
    } catch (error) {
        console.error("Error connecting to db", error);
    }
};
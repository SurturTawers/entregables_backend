import mongoose from 'mongoose';
const URI = 'mongodb+srv://davtorresga:o8zptZ0gRn5XTPFN@cluster0.rxh3ug0.mongodb.net/carts?retryWrites=true&w=majority';

export const init = async () =>{
    try {
        //const URI = process.env.MONGODB_URI;
        await mongoose.connect(URI);
        console.log("DB connected");
    } catch (error) {
        console.error("Error connecting to db", error);
    }
};
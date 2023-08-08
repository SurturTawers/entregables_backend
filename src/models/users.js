import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true, default: 'user'},
    carrito: {type: mongoose.Schema.Types.ObjectId},
    loginDate: {type: Date},
    expireDate: {type:Date}
});

export default mongoose.model('User', userSchema);
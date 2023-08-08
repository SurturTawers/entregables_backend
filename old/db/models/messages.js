import mongoose from 'mongoose';
const messages = new mongoose.Schema({
}, {timestamps: true,});

export default mongoose.model('messagesModel', messages);
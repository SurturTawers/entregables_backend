import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    amount: {type: Number, required: true},
    purchaser: {type: String, required: true}
}, {
    timestamps: {
        createdAt: 'purchase_datetime'
    }
});

export default mongoose.model('ticket', ticketSchema);
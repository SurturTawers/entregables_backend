import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    total: {type: Number, required: true},
    purchaser: {type: String, required: true},
    items: [{
        id_producto: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
        cantidad: {type: Number},
        subtotal: {type:Number}
    }]
}, {
    timestamps: {
        createdAt: 'purchase_datetime'
    }
});

export default mongoose.model('ticket', ticketSchema);
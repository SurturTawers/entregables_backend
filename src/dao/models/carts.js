import mongoose from 'mongoose';
const carts = new mongoose.Schema({
    products: [{type: mongoose.Schema.Types.ObjectId, ref:'products'}]
}, {timestamps: true,});

export default mongoose.model('cartsModel', carts);
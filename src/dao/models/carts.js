import mongoose from 'mongoose';
const cartsSchema = new mongoose.Schema({
    products: [{type: mongoose.Schema.Types.ObjectId, ref:'products'}]
}, {timestamps: true,});

export default mongoose.model('carts', cartsSchema);

import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
    date: { type: String, required: true },
    items: [{
        dishId: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Sale', SaleSchema);

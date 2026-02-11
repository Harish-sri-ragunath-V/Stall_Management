
import mongoose from 'mongoose';

const DishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: 'Main Course' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Dish', DishSchema);

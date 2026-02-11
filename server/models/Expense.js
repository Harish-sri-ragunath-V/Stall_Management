
import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: 'Supplies' },
    date: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Expense', ExpenseSchema);

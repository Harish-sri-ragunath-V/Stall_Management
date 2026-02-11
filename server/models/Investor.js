
import mongoose from 'mongoose';

const InvestorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

export default mongoose.model('Investor', InvestorSchema);

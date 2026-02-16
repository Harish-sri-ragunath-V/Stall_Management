
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import Dish from './models/Dish.js';
import Sale from './models/Sale.js';
import Investor from './models/Investor.js';
import Expense from './models/Expense.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://stall_admin:stall2026@cluster0.hkrv9ee.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Root API Health Check
app.get('/api', (req, res) => res.json({ status: 'API Active' }));

// Dishes
app.get('/api/dishes', async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.json(dishes.map(d => ({ ...d._doc, id: d._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/dishes', async (req, res) => {
    try {
        const newDish = new Dish(req.body);
        const savedDish = await newDish.save();
        res.json({ ...savedDish._doc, id: savedDish._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/dishes/:id', async (req, res) => {
    try {
        const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ ...updatedDish._doc, id: updatedDish._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/dishes/:id', async (req, res) => {
    try {
        await Dish.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sales
app.get('/api/sales', async (req, res) => {
    try {
        const sales = await Sale.find().sort({ timestamp: -1 });
        res.json(sales.map(s => ({ ...s._doc, id: s._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/sales', async (req, res) => {
    try {
        const saleData = req.body;
        if (!saleData.orderNo) {
            const lastSale = await Sale.findOne().sort({ timestamp: -1 });
            let nextOrderNo = 1;
            if (lastSale && lastSale.orderNo) {
                const lastNo = parseInt(lastSale.orderNo);
                if (!isNaN(lastNo)) {
                    nextOrderNo = lastNo + 1;
                }
            }
            saleData.orderNo = nextOrderNo.toString();
        }
        const newSale = new Sale(saleData);
        const savedSale = await newSale.save();
        res.json({ ...savedSale._doc, id: savedSale._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Investors
app.get('/api/investors', async (req, res) => {
    try {
        const investors = await Investor.find();
        res.json(investors.map(i => ({ ...i._doc, id: i._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/investors', async (req, res) => {
    try {
        const newInvestor = new Investor(req.body);
        const savedInvestor = await newInvestor.save();
        res.json({ ...savedInvestor._doc, id: savedInvestor._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/investors/:id', async (req, res) => {
    try {
        const updated = await Investor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ ...updated._doc, id: updated._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/investors/:id', async (req, res) => {
    try {
        await Investor.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ timestamp: -1 });
        res.json(expenses.map(e => ({ ...e._doc, id: e._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/expenses', async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        const savedExpense = await newExpense.save();
        res.json({ ...savedExpense._doc, id: savedExpense._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

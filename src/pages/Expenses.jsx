
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, Search, TrendingDown, Calendar, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Expenses = () => {
    const { expenses, addExpense, removeExpense } = useApp();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Supplies',
        date: new Date().toISOString().split('T')[0]
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const handleSubmit = (e) => {
        e.preventDefault();
        addExpense({ ...formData, amount: Number(formData.amount) });
        setFormData({
            description: '',
            amount: '',
            category: 'Supplies',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const categories = ['All', 'Supplies', 'Utility', 'Rent', 'Maintenance', 'Other'];

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All' || expense.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const totalExpenseValue = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-center xl:items-end gap-6 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] backdrop-blur-xl">
                <div className="space-y-2 w-full text-center xl:text-left">
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">Expenses</h1>
                    <p className="text-slate-500 font-bold text-sm">Monitor operational costs and purchase history</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Find an entry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-rose-500/50 transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center justify-between sm:justify-center gap-3 bg-slate-950/50 border border-slate-800 px-6 py-4 rounded-2xl h-[56px] w-full sm:w-auto">
                        <TrendingDown className="text-rose-400 w-5 h-5 flex-shrink-0" />
                        <span className="text-white font-black text-lg">₹{totalExpenseValue.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                {/* Entries List */}
                <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-full sm:w-fit justify-center overflow-hidden">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === cat
                                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredExpenses.map((expense, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                    key={expense.id}
                                    className="group flex flex-col sm:flex-row items-center justify-between p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-rose-500/30 transition-all duration-500 gap-6"
                                >
                                    <div className="flex items-center gap-5 w-full sm:w-auto">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-950 rounded-2xl border border-white/5 flex-shrink-0 flex items-center justify-center text-rose-400">
                                            <Receipt className="w-6 h-6 sm:w-7 sm:h-7" />
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">{expense.category}</p>
                                            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase truncate">{expense.description}</h3>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar className="w-3 h-3" />
                                                <span className="text-[10px] font-bold uppercase">{new Date(expense.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/50 pt-4 sm:pt-0">
                                        <div className="text-left sm:text-right">
                                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none mb-1">Amount</p>
                                            <p className="text-xl sm:text-2xl font-black text-rose-400 tracking-tighter leading-none">₹{expense.amount.toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => removeExpense(expense.id)}
                                            className="p-3 bg-slate-950/80 hover:bg-rose-500/10 rounded-xl text-slate-500 hover:text-rose-500 border border-white/5 transition-all active:scale-95 flex-shrink-0"
                                        >
                                            <PlusCircle className="w-5 h-5 rotate-45" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredExpenses.length === 0 && (
                            <div className="py-20 bg-slate-900 border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center">
                                <TrendingDown className="w-16 h-16 text-slate-800 mb-6 opacity-20" />
                                <div className="text-center space-y-2 px-6">
                                    <p className="text-xl font-black text-slate-500 uppercase tracking-tighter">No Entries</p>
                                    <p className="text-slate-700 font-bold text-sm">Your expense ledger is currently clear</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar form */}
                <div className="lg:col-span-4 order-1 lg:order-2">
                    <div className="lg:sticky lg:top-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 space-y-8 shadow-xl">
                        <div className="space-y-1 text-center sm:text-left">
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Record Expense</h2>
                            <p className="text-slate-500 text-sm font-medium">Add a new operational cost</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Description</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-rose-500 transition-all text-sm font-black"
                                    placeholder="e.g. Utility Bill"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Amount</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-black text-lg focus:outline-none transition-all"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Category</label>
                                    <div className="relative">
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm font-black focus:outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option>Supplies</option>
                                            <option>Utility</option>
                                            <option>Rent</option>
                                            <option>Maintenance</option>
                                            <option>Other</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Date</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-black text-sm focus:outline-none transition-all cursor-pointer"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 rounded-2xl sm:rounded-3xl bg-rose-600 text-white font-black text-xl hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20 active:scale-95"
                            >
                                Save Entry
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expenses;

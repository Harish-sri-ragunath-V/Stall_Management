
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Calendar, CheckCircle, TrendingUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SalesEntry = () => {
    const { dishes, addSale, sales, isAuthenticated } = useApp();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [quantities, setQuantities] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const initial = {};
        dishes.forEach(d => initial[d.id] = 0);
        setQuantities(initial);
    }, [dishes]);

    const handleQuantityChange = (id, value) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(0, parseInt(value) || 0)
        }));
    };

    const calculateTotal = () => {
        return dishes.reduce((total, dish) => {
            const qty = quantities[dish.id] || 0;
            return total + (qty * dish.price);
        }, 0);
    };

    const getItemsCount = () => Object.values(quantities).reduce((a, b) => a + b, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const totalAmount = calculateTotal();
        const soldItems = dishes.map(dish => ({
            dishId: dish.id,
            name: dish.name,
            price: dish.price,
            quantity: quantities[dish.id] || 0
        })).filter(item => item.quantity > 0);

        if (soldItems.length === 0) return;
        addSale({ date, items: soldItems, totalAmount });

        const reset = {};
        dishes.forEach(d => reset[d.id] = 0);
        setQuantities(reset);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    const categories = ['All', ...new Set(dishes.map(d => d.category || 'General'))];
    const filteredDishes = dishes.filter(d =>
        (activeCategory === 'All' || (d.category || 'General') === activeCategory) &&
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSales = sales.filter(s => s.date === viewDate);

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-12 pb-20">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row justify-between items-center xl:items-center gap-6 sm:gap-8 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] backdrop-blur-xl">
                <div className="space-y-2 w-full text-center xl:text-left">
                    <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 flex-shrink-0">
                            <TrendingUp className="text-white w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-1 uppercase">Sales Console</h1>
                            <p className="text-slate-500 font-bold text-sm">Record and manage daily dish sales</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Quick search dishes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3 bg-slate-950/50 border border-slate-800 p-2 rounded-2xl px-5 h-[56px] w-full sm:w-auto">
                        <Calendar className="text-indigo-400 w-5 h-5 flex-shrink-0" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent text-white font-black text-sm focus:outline-none cursor-pointer w-full sm:w-auto"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                {/* Menu Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/50 rounded-2xl border border-slate-800 w-full lg:w-fit justify-center lg:justify-start overflow-hidden">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredDishes.map((dish, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={dish.id}
                                    className={`relative p-5 rounded-3xl border transition-all duration-300 ${(quantities[dish.id] || 0) > 0
                                        ? 'bg-indigo-600/10 border-indigo-500/50'
                                        : 'bg-slate-900 border-slate-800'
                                        }`}
                                >
                                    <div className="space-y-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-white font-black text-lg tracking-tight leading-none uppercase">{dish.name}</h3>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">{dish.category || 'General'}</p>
                                            </div>
                                            <p className="text-emerald-400 font-black text-base whitespace-nowrap">₹{dish.price}</p>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 flex items-center justify-between bg-slate-950/50 p-1.5 rounded-2xl border border-white/5">
                                                {isAuthenticated ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleQuantityChange(dish.id, (quantities[dish.id] || 0) - 1)}
                                                            className="w-8 h-8 rounded-xl bg-slate-900 text-slate-400 font-black active:scale-95 transition-all text-sm"
                                                        >-</button>
                                                        <input
                                                            type="number"
                                                            value={quantities[dish.id] || ''}
                                                            onChange={(e) => handleQuantityChange(dish.id, e.target.value)}
                                                            className="bg-transparent text-white text-center font-black text-base w-8 focus:outline-none"
                                                            placeholder="0"
                                                        />
                                                        <button
                                                            onClick={() => handleQuantityChange(dish.id, (quantities[dish.id] || 0) + 1)}
                                                            className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black active:scale-95 transition-all text-sm"
                                                        >+</button>
                                                    </>
                                                ) : (
                                                    <div className="flex-1 text-center py-2 text-slate-600 font-black text-[10px] uppercase tracking-widest">
                                                        Login to edit
                                                    </div>
                                                )}
                                            </div>
                                            {(quantities[dish.id] || 0) > 0 && (
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none mb-1">Total</p>
                                                    <p className="text-white font-black text-base">₹{((quantities[dish.id] || 0) * dish.price).toLocaleString()}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredDishes.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem]">
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">No matching dishes found</p>
                        </div>
                    )}
                </div>

                {/* Sidebar: Session Audit */}
                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 space-y-8 shadow-3xl backdrop-blur-2xl">
                        <div className="space-y-1 text-center sm:text-left">
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Session Audit</h2>
                            <p className="text-slate-500 text-sm font-medium">Verify aggregate totals before committing</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 shadow-inner space-y-8">
                                <div className="flex flex-col items-center text-center">
                                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mb-4">Realized Revenue</p>
                                    <div className="flex items-start justify-center">
                                        <span className="text-indigo-500 font-black text-xl mt-2 tracking-tighter mr-1">₹</span>
                                        <p className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-none">{calculateTotal().toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-6">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Item Count</p>
                                        <p className="text-xl font-black text-white">{getItemsCount()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Average/Dish</p>
                                        <p className="text-xl font-black text-white">₹{getItemsCount() > 0 ? (calculateTotal() / getItemsCount()).toFixed(0) : 0}</p>
                                    </div>
                                </div>
                            </div>

                            {isAuthenticated ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={calculateTotal() === 0}
                                    className={`w-full py-5 sm:py-6 rounded-2xl sm:rounded-[2.5rem] font-black text-lg sm:text-xl transition-all duration-700 active:scale-95 flex items-center justify-center gap-4 ${isSubmitted
                                        ? 'bg-emerald-500 text-white shadow-3xl shadow-emerald-500/20'
                                        : 'bg-white text-slate-950 hover:bg-slate-100 shadow-3xl shadow-white/5 disabled:opacity-20 disabled:grayscale'
                                        }`}
                                >
                                    {isSubmitted ? (
                                        <><CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" /> Committed</>
                                    ) : (
                                        <><Save className="w-6 h-6 sm:w-7 sm:h-7" /> Add Records</>
                                    )}
                                </button>
                            ) : (
                                <div className="text-center p-6 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Authentication Required for Sales Logging</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Historical Audit Trail */}
            <div className="pt-12 sm:pt-20 border-t border-slate-900/50 space-y-8 lg:space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
                    <div className="space-y-2">
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase leading-none">Historical Audit</h2>
                        <p className="text-slate-500 font-medium text-sm">Review past transactions by date</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 border-dashed w-full sm:w-auto">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-4 hidden sm:block">Filter Logs</span>
                        <div className="bg-slate-950 p-2 px-4 rounded-xl border border-white/5 h-[44px] flex items-center w-full sm:w-auto">
                            <input
                                type="date"
                                value={viewDate}
                                onChange={(e) => setViewDate(e.target.value)}
                                className="bg-transparent text-indigo-400 font-black text-xs focus:outline-none cursor-pointer uppercase w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredSales.map((sale) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={sale.id}
                                className="group bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 hover:border-indigo-500/30 transition-all duration-500 shadow-xl"
                            >
                                <div className="flex flex-col gap-6">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex-shrink-0 flex items-center justify-center">
                                                <Calendar className="text-indigo-400 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-base sm:text-lg tracking-tight leading-none">
                                                    {new Date(sale.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Transaction Success</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Total</p>
                                            <p className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tighter">₹{sale.totalAmount.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 border-t border-slate-800 pt-6">
                                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] mb-3">Itemized Breakdown</p>
                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                            {sale.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-[11px] sm:text-xs">
                                                    <div className="flex gap-2 text-slate-400 font-bold overflow-hidden">
                                                        <span className="text-indigo-400 flex-shrink-0">x{item.quantity}</span>
                                                        <span className="uppercase truncate">{item.name}</span>
                                                    </div>
                                                    <span className="text-white font-black flex-shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredSales.length === 0 && (
                        <div className="col-span-full py-20 sm:py-32 flex flex-col items-center justify-center gap-6 bg-slate-900/10 border-2 border-dashed border-slate-800 rounded-[2rem] sm:rounded-[3rem]">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 flex items-center justify-center rounded-full border border-slate-800 opacity-20">
                                <Calendar className="text-slate-700 w-8 h-8 sm:w-10 sm:h-10" />
                            </div>
                            <div className="text-center space-y-2 px-6">
                                <p className="text-xl sm:text-2xl font-black text-slate-500 tracking-tighter uppercase">Audit Signal Void</p>
                                <p className="text-slate-700 font-bold text-xs sm:text-sm max-w-xs mx-auto">No transaction vectors detected for this timestamp index.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesEntry;

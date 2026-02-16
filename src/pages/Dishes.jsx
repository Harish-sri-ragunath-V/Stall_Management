
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Edit2, Utensils, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dishes = () => {
    const { dishes, addDish, removeDish, updateDish, isAuthenticated } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [formData, setFormData] = useState({ name: '', price: '', category: 'Main Course' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateDish(editingId, { ...formData, price: Number(formData.price) });
        } else {
            addDish({ ...formData, price: Number(formData.price) });
        }
        closeModal();
    };

    const openEdit = (dish) => {
        setEditingId(dish.id);
        setFormData({ name: dish.name, price: dish.price, category: dish.category || 'Main Course' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', price: '', category: 'Main Course' });
    };

    const categories = ['All', 'Main Course', 'Starter', 'Dessert', 'Beverage'];

    const filteredDishes = dishes.filter(dish => {
        const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All' || (dish.category || 'Main Course') === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-center xl:items-end gap-6 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] backdrop-blur-xl">
                <div className="space-y-2 w-full text-center xl:text-left">
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">Menu List</h1>
                    <p className="text-slate-500 font-bold text-sm">Manage your menu items and prices</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative w-full sm:w-80 font-medium">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                        />
                    </div>
                    {isAuthenticated && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                        >
                            <Plus className="w-5 h-5 flex-shrink-0" /> Add New Dish
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-full sm:w-fit justify-center">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === cat
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredDishes.map((dish, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ delay: Math.min(index * 0.05, 0.5) }}
                            key={dish.id}
                            className="group relative bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col hover:border-indigo-500/30 transition-all duration-500 shadow-lg"
                        >
                            <div className="flex justify-between w-full mb-6">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Utensils className="w-6 h-6" />
                                </div>
                                {isAuthenticated && (
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(dish)} className="p-2.5 bg-slate-950 hover:bg-indigo-500/10 rounded-xl text-slate-400 hover:text-indigo-400 border border-white/5 transition-all">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => removeDish(dish.id)} className="p-2.5 bg-slate-950 hover:bg-rose-500/10 rounded-xl text-slate-400 hover:text-rose-500 border border-white/5 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1 mb-6 flex-1">
                                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-none">{dish.category || 'Main Course'}</span>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase leading-tight">{dish.name}</h3>
                            </div>

                            <div className="w-full bg-slate-950 rounded-2xl p-4 border border-white/5 flex items-baseline justify-between transition-colors group-hover:bg-slate-950/80">
                                <span className="text-[10px] font-black text-slate-600 uppercase">Price Unit</span>
                                <span className="text-2xl font-black text-emerald-400 tracking-tighter">₹{dish.price}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredDishes.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-900 border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center">
                        <Utensils className="w-16 h-16 text-slate-800 mb-6 opacity-20" />
                        <div className="text-center space-y-2">
                            <p className="text-xl font-black text-slate-500 uppercase tracking-tighter">No Dishes Found</p>
                            <p className="text-slate-700 font-bold text-sm">No items match your search parameters</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal - Mobile Optimized */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 sm:p-10 w-full max-w-md shadow-2xl my-auto"
                        >
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-2">{editingId ? 'Edit Dish' : 'New Dish'}</h2>
                                <p className="text-slate-500 font-bold text-sm tracking-tight">Configure your dish details below</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Dish Identity</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-400 transition-all text-sm font-medium"
                                        placeholder="Dish Name"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Price (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                                                {categories.filter(c => c !== 'All').map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-4 rounded-xl sm:rounded-2xl bg-slate-800 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 rounded-xl sm:rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl shadow-white/5"
                                    >
                                        {editingId ? 'Save' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dishes;

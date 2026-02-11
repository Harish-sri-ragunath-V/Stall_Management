
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserPlus, TrendingUp, Search, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Investors = () => {
    const { investors, addInvestor, updateInvestor, removeInvestor } = useApp();
    const [formData, setFormData] = useState({ name: '', amount: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateInvestor(editingId, { ...formData, amount: Number(formData.amount) });
        } else {
            addInvestor({ ...formData, amount: Number(formData.amount) });
        }
        closeModal();
    };

    const openEdit = (investor) => {
        setEditingId(investor.id);
        setFormData({ name: investor.name, amount: investor.amount });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', amount: '' });
    };

    const totalInvestment = investors.reduce((sum, i) => sum + i.amount, 0);
    const filteredInvestors = investors.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1600px] mx-auto px-1 sm:px-6 lg:px-8 space-y-6 lg:space-y-12 pb-20 overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row justify-between items-center xl:items-end gap-6 bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] backdrop-blur-xl">
                <div className="space-y-1 w-full text-center xl:text-left">
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">Partners</h1>
                    <p className="text-slate-500 font-bold text-[10px] sm:text-sm uppercase tracking-widest leading-none">Capital stakeholders management</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Find partner..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                    >
                        <UserPlus className="w-5 h-5 flex-shrink-0" /> <span className="text-[10px] uppercase font-black tracking-widest">Add Partner</span>
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
                <div className="bg-slate-900 border border-slate-800 p-4 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center justify-between group shadow-lg gap-4">
                    <div className="flex flex-col text-center sm:text-left min-w-0">
                        <p className="text-slate-500 text-[8px] sm:text-[11px] font-black uppercase tracking-widest leading-none mb-1">Total Capital</p>
                        <p className="text-lg sm:text-3xl font-black text-white tracking-tighter leading-none truncate">₹{totalInvestment.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center justify-between group shadow-lg gap-4">
                    <div className="flex flex-col text-center sm:text-left min-w-0">
                        <p className="text-slate-500 text-[8px] sm:text-[11px] font-black uppercase tracking-widest leading-none mb-1">Partners</p>
                        <p className="text-lg sm:text-3xl font-black text-white tracking-tighter leading-none">{investors.length}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                </div>
            </div>

            {/* Partners List - Responsive Card/Table */}
            <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase px-2 text-center sm:text-left">Directory</h2>

                {/* Mobile View */}
                <div className="grid grid-cols-1 gap-4 sm:hidden px-2">
                    {filteredInvestors.map((investor) => (
                        <div key={investor.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase">
                                        {investor.name.charAt(0)}
                                    </div>
                                    <span className="font-bold text-white text-sm truncate max-w-[120px]">{investor.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(investor)} className="p-2 bg-slate-950 rounded-xl text-slate-400 border border-white/5"><Edit2 className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => removeInvestor(investor.id)} className="p-2 bg-slate-950 rounded-xl text-rose-500 border border-white/5"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <p className="text-[10px] text-slate-500 font-medium">Joined {new Date(investor.date || new Date()).toLocaleDateString()}</p>
                                <span className="font-black text-emerald-400 text-lg leading-none">₹{investor.amount.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="hidden sm:block bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="px-10 py-5 text-nowrap">Name</th>
                                    <th className="px-10 py-5">Joined</th>
                                    <th className="px-10 py-5">Investment</th>
                                    <th className="px-10 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredInvestors.map((investor) => (
                                    <tr key={investor.id} className="hover:bg-slate-800/20 transition-all group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-950 rounded-xl border border-white/5 flex-shrink-0 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase group-hover:scale-110 transition-transform">
                                                    {investor.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-white text-base leading-none">{investor.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-slate-400 text-sm font-medium">
                                            {new Date(investor.date || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="font-black text-emerald-400 text-lg">₹{investor.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-2 outline-none">
                                                <button onClick={() => openEdit(investor)} className="p-2.5 bg-slate-950 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white border border-white/5 transition-all"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => removeInvestor(investor.id)} className="p-2.5 bg-slate-950 hover:bg-rose-500/10 rounded-xl text-slate-400 hover:text-rose-500 border border-white/5 transition-all"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredInvestors.length === 0 && (
                    <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-[2.5rem]">
                        <Users className="w-16 h-16 text-slate-800 mx-auto mb-4 opacity-10" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Record Empty</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 sm:p-10 w-full max-w-md shadow-2xl"
                        >
                            <div className="mb-8 text-center">
                                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase mb-1">
                                    {editingId ? 'Edit Partner' : 'Add Partner'}
                                </h2>
                                <p className="text-slate-500 font-bold text-[10px] sm:text-sm uppercase tracking-widest">Stakeholder information profile</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Partner Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium"
                                        placeholder="Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Investment (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-black text-xl focus:outline-none focus:border-emerald-500 transition-all"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-4 rounded-2xl bg-slate-800 text-slate-400 font-black uppercase tracking-widest text-[10px]"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 active:scale-95"
                                    >
                                        Confirm
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

export default Investors;


import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
    Calendar, DollarSign, ArrowRight, Activity, Receipt, Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';

const Performance = () => {
    const { sales, expenses, investors } = useApp();

    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const { dailyData, totals } = useMemo(() => {
        const fullRange = [];
        let curr = new Date(startDate);
        const end = new Date(endDate);

        while (curr <= end) {
            const dateStr = curr.toISOString().split('T')[0];
            const daySales = sales.filter(s => s.date === dateStr).reduce((acc, s) => acc + s.totalAmount, 0);
            const dayExpenses = expenses.filter(e => e.date === dateStr).reduce((acc, e) => acc + e.amount, 0);
            const dayInvested = investors.filter(i => (i.date || '').split('T')[0] === dateStr).reduce((acc, i) => acc + i.amount, 0);

            fullRange.push({
                date: dateStr,
                sales: daySales,
                expenses: dayExpenses,
                invested: dayInvested,
                profit: daySales - dayExpenses
            });
            curr.setDate(curr.getDate() + 1);
        }

        const calculatedTotals = fullRange.reduce((acc, curr) => ({
            sales: acc.sales + curr.sales,
            expenses: acc.expenses + curr.expenses,
            invested: acc.invested + curr.invested,
            profit: acc.profit + curr.profit
        }), { sales: 0, expenses: 0, invested: 0, profit: 0 });

        return {
            dailyData: fullRange.filter(day => day.sales > 0).sort((a, b) => new Date(b.date) - new Date(a.date)),
            totals: calculatedTotals
        };
    }, [sales, expenses, investors, startDate, endDate]);

    return (
        <div className="max-w-[1600px] mx-auto px-1 sm:px-6 lg:px-8 space-y-6 lg:space-y-12 pb-20 overflow-hidden">
            {/* Header / Date Range */}
            <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-slate-900 border border-slate-800 p-5 sm:p-10 rounded-[2rem] sm:rounded-[3rem] backdrop-blur-xl">
                <div className="space-y-1 w-full text-center xl:text-left">
                    <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">Performance</h1>
                    <p className="text-slate-500 font-bold text-[10px] sm:text-sm uppercase tracking-widest">Financial logs and capital movement</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-white/5 w-full xl:w-auto">
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900 rounded-xl w-full sm:w-auto">
                        <Calendar className="text-indigo-400 w-3.5 h-3.5 flex-shrink-0" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent text-white font-black text-[11px] focus:outline-none cursor-pointer w-full"
                        />
                    </div>
                    <ArrowRight className="text-slate-700 w-4 h-4 hidden sm:block flex-shrink-0" />
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900 rounded-xl w-full sm:w-auto">
                        <Calendar className="text-indigo-400 w-3.5 h-3.5 flex-shrink-0" />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent text-white font-black text-[11px] focus:outline-none cursor-pointer w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {[
                    { label: 'Invested', value: totals.invested, icon: Wallet, color: 'indigo' },
                    { label: 'Sales', value: totals.sales, icon: DollarSign, color: 'emerald' },
                    { label: 'Expenses', value: totals.expenses, icon: Receipt, color: 'rose' },
                    { label: 'Profit', value: totals.profit, icon: Activity, color: totals.profit >= 0 ? 'emerald' : 'orange' }
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl relative overflow-hidden group shadow-lg"
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 relative z-10 text-center sm:text-left">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-slate-950 rounded-xl flex-shrink-0 flex items-center justify-center text-${stat.color}-400 shadow-inner group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex flex-col min-w-0 w-full">
                                <p className="text-slate-500 text-[8px] sm:text-[11px] font-black uppercase tracking-widest leading-none mb-1 truncate">{stat.label}</p>
                                <p className="text-lg sm:text-2xl font-black text-white tracking-tighter leading-none truncate">₹{stat.value.toLocaleString()}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Daily Breakdown Table - Responsive Version */}
            <div className="space-y-4 sm:space-y-6">
                <div className="px-2 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase leading-none">Daily Breakdown</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Chronological record suite</p>
                </div>

                {/* Mobile Card View (shown only on small screens) */}
                <div className="grid grid-cols-1 gap-4 sm:hidden px-2">
                    {dailyData.length > 0 ? (
                        dailyData.map((day) => (
                            <div key={day.date} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
                                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-center text-indigo-400 font-black text-xs">
                                            {new Date(day.date).getDate()}
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-xs uppercase leading-none">
                                                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short' })}
                                            </p>
                                            <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">{new Date(day.date).getFullYear()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Net Profit</p>
                                        <p className={`text-lg font-black tracking-tighter ${day.profit >= 0 ? 'text-emerald-400' : 'text-orange-500'}`}>
                                            ₹{day.profit.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Invested</p>
                                        <p className="text-xs font-black text-indigo-400">₹{day.invested.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Expenses</p>
                                        <p className="text-xs font-black text-rose-500/80">₹{day.expenses.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center bg-slate-900 border border-slate-800 rounded-2xl opacity-30">
                            <Activity className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                            <p className="text-[10px] font-black text-slate-500 uppercase">No Data</p>
                        </div>
                    )}
                </div>

                {/* Table View (hidden on mobile, shown on desktop) */}
                <div className="hidden sm:block bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="px-10 py-5">Date</th>
                                    <th className="px-10 py-5 text-indigo-400">Total Invested</th>
                                    <th className="px-10 py-5 text-rose-400">Total Expenses</th>
                                    <th className="px-10 py-5 text-right text-emerald-400">Net Profit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {dailyData.map((day) => (
                                    <tr key={day.date} className="hover:bg-slate-800/20 transition-all group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-950 rounded-xl border border-white/5 flex-shrink-0 flex items-center justify-center text-indigo-400 font-black text-xs uppercase group-hover:scale-110 transition-transform">
                                                    {new Date(day.date).getDate()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-black text-xs uppercase text-nowrap">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short' })}</p>
                                                    <p className="text-[10px] text-slate-600 font-bold uppercase">{new Date(day.date).getFullYear()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 font-black text-sm text-indigo-400">₹{day.invested.toLocaleString()}</td>
                                        <td className="px-10 py-6 font-black text-sm text-rose-500/50">₹{day.expenses.toLocaleString()}</td>
                                        <td className="px-10 py-6 text-right font-black text-lg tracking-tighter">
                                            <span className={day.profit >= 0 ? 'text-emerald-400' : 'text-orange-500'}>
                                                ₹{day.profit.toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Performance;

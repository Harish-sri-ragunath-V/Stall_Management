
import React from 'react';
import { useApp } from '../context/AppContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Activity, Zap, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden group shadow-lg"
    >
        <div className="flex justify-between items-start mb-6 relative z-10">
            <div className={`w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-${color}-400 shadow-inner ring-1 ring-white/5 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} border border-white/5`}>
                    {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div className="space-y-1 relative z-10">
            <h3 className="text-slate-500 text-[10px] font-black tracking-widest uppercase">{title}</h3>
            <p className="text-3xl font-black text-white tracking-tighter leading-none">{value}</p>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { sales, expenses, investors, dishes } = useApp();

    const totalSales = sales.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalInvested = investors.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const netProfit = totalSales - totalExpenses;

    const dishPerformance = React.useMemo(() => {
        return dishes.map(dish => {
            let totalSold = 0;
            let totalRevenue = 0;
            sales.forEach(sale => {
                const item = sale.items?.find(i => i.dishId === dish.id);
                if (item) {
                    totalSold += item.quantity;
                    totalRevenue += (item.quantity * item.price);
                }
            });
            return { name: dish.name, sold: totalSold, revenue: totalRevenue };
        }).sort((a, b) => b.sold - a.sold);
    }, [sales, dishes]);

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-12 pb-20">
            {/* Simple Header */}
            <div className="flex flex-col xl:flex-row justify-between items-center xl:items-end gap-6 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] backdrop-blur-xl">
                <div className="space-y-2 w-full text-center xl:text-left">
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">Dashboard</h1>
                    <p className="text-slate-500 font-bold text-sm">Business overview and performance tracking</p>
                </div>

                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <div className="flex-1 xl:flex-none flex items-center justify-center gap-3 bg-slate-950 px-6 py-4 rounded-2xl border border-white/5">
                        <Calendar className="text-indigo-400 w-5 h-5 flex-shrink-0" />
                        <span className="text-white font-black text-[11px] sm:text-xs uppercase tracking-widest text-nowrap">Today: {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 group hover:bg-indigo-500 transition-colors flex-shrink-0">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    title="Total Capital"
                    value={`₹${totalInvested.toLocaleString()}`}
                    icon={Wallet}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${totalSales.toLocaleString()}`}
                    icon={DollarSign}
                    color="emerald"
                    trend={15.8}
                    delay={0.2}
                />
                <StatCard
                    title="Total Expense"
                    value={`₹${totalExpenses.toLocaleString()}`}
                    icon={TrendingDown}
                    color="rose"
                    delay={0.3}
                />
                <StatCard
                    title="Net Profit"
                    value={`₹${netProfit.toLocaleString()}`}
                    icon={Activity}
                    color={netProfit >= 0 ? "indigo" : "orange"}
                    trend={netProfit > 0 ? 12.4 : -5.2}
                    delay={0.4}
                />
            </div>

            {/* Performance Breakdown */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-xl overflow-hidden relative">
                    <div className="mb-10 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 text-center sm:text-left">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Sales by Item</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Quantity of items sold</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none">Total Sold</p>
                            <p className="text-2xl font-black text-indigo-400 tracking-tighter leading-none">{dishPerformance.reduce((a, b) => a + b.sold, 0)}</p>
                        </div>
                    </div>

                    <div className="h-64 sm:h-80 w-full overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dishPerformance}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.3} />
                                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} tickFormatter={(val) => val.length > 8 ? val.slice(0, 6) + '..' : val} />
                                <YAxis stroke="#475569" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', color: '#f8fafc', fontWeight: '900', fontSize: '10px' }}
                                />
                                <Bar dataKey="sold" fill="#6366f1" radius={[8, 8, 0, 0]} name="Units" barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-xl relative overflow-hidden group">
                    <div className="mb-10 text-center sm:text-left">
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">Revenue Sources</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">Top performing items by earnings</p>
                    </div>

                    <div className="space-y-3">
                        {dishPerformance.slice(0, 5).map((dish, index) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                key={index}
                                className="flex items-center justify-between p-4 sm:p-5 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all duration-500 shadow-inner group/item"
                            >
                                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover/item:text-emerald-400 transition-all">
                                        0{index + 1}
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <p className="text-white font-black text-xs uppercase tracking-tight truncate">{dish.name}</p>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest truncate">{dish.sold} sold</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 pl-4">
                                    <p className="text-base sm:text-lg font-black text-emerald-400 tracking-tighter leading-none">₹{dish.revenue.toLocaleString()}</p>
                                    <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest pt-1">Total Revenue</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {dishPerformance.length === 0 && (
                        <div className="h-64 flex flex-col items-center justify-center opacity-20">
                            <TrendingUp className="w-12 h-12 text-slate-700 mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

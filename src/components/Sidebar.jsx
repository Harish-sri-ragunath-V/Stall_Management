
import { LayoutDashboard, Utensils, IndianRupee, PieChart, Users, TrendingUp, X, Activity } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { isAuthenticated } = useApp();
    const links = [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/entry', label: 'Sales Console', icon: IndianRupee },
        { to: '/dishes', label: 'Menu List', icon: Utensils },
        { to: '/expenses', label: 'Expenses', icon: PieChart },
        { to: '/performance', label: 'Performance', icon: Activity },
        { to: '/investors', label: 'Partners', icon: Users },
    ];

    if (!isAuthenticated) {
        links.push({ to: '/login', label: 'Login', icon: TrendingUp });
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 md:hidden transition-all duration-500"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed left-0 top-0 h-screen w-72 bg-slate-950 border-r border-white/5 flex flex-col z-50 transition-all duration-500 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}>
                <div className="p-10 border-b border-white/5 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40">
                                <TrendingUp className="text-white w-6 h-6" />
                            </div>
                            <span className="font-black text-2xl text-white tracking-tighter uppercase italic">E-Horizon</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] pl-1">Management</p>
                    </div>
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-2">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 p-6 space-y-3">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => onClose()}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden ${isActive
                                    ? 'bg-indigo-600 shadow-xl shadow-indigo-600/20 text-white'
                                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                                }`
                            }
                        >
                            <link.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110`} />
                            <span className="font-black text-xs uppercase tracking-widest">{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-8 mt-auto border-t border-white/5 opacity-40">
                    <div className="text-center">
                        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.4em]">Business Terminal</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

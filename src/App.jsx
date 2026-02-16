
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Menu, TrendingUp, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Dishes from './pages/Dishes';
import SalesEntry from './pages/Sales';
import Investors from './pages/Investors';
import Expenses from './pages/Expenses';
import Performance from './pages/Performance';
import Login from './pages/Login';
import { useApp } from './context/AppContext';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, logout, loading } = useApp();

  useEffect(() => {
    console.log('Auth Status:', isAuthenticated);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <TrendingUp className="w-12 h-12 text-indigo-500 animate-pulse" />
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Waking up the server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 md:ml-72 flex flex-col min-h-screen transition-all duration-500">
        {/* Mobile Header (Refined) */}
        <header className="md:hidden bg-slate-950/80 backdrop-blur-xl border-b border-white/5 p-5 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white w-4 h-4" />
            </div>
            <span className="font-black text-sm text-white uppercase tracking-widest italic">E-Horizon</span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-slate-400 hover:text-red-400 p-2 bg-slate-900 rounded-lg border border-white/5 shadow-inner transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <NavLink
                to="/login"
                className="text-slate-400 hover:text-indigo-400 p-2 bg-slate-900 rounded-lg border border-white/5 shadow-inner transition-colors"
                title="Login"
              >
                <TrendingUp className="w-5 h-5" />
              </NavLink>
            )}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-400 hover:text-white p-2 bg-slate-900 rounded-lg border border-white/5 shadow-inner"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Desktop Auth Button */}
        <div className="hidden md:block absolute top-6 right-10 z-20">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-red-500/10 hover:text-red-400 text-slate-400 border border-white/5 rounded-xl transition-all duration-300 group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-400 border border-white/5 rounded-xl transition-all duration-300 group"
            >
              <TrendingUp className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-medium">Login</span>
            </NavLink>
          )}
        </div>

        <main className="p-4 sm:p-6 lg:p-10 overflow-y-auto flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dishes" element={<Dishes />} />
            <Route path="/entry" element={<SalesEntry />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;

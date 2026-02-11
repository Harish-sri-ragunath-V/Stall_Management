
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('stall_auth') === 'true'
  );

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    localStorage.setItem('stall_auth', status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('stall_auth');
  };

  return (
    <Router>
      <AppProvider>
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
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
                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-400 p-2 bg-slate-900 rounded-lg border border-white/5 shadow-inner transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="text-slate-400 hover:text-white p-2 bg-slate-900 rounded-lg border border-white/5 shadow-inner"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Desktop Logout Button (Optional but useful) */}
              <div className="hidden md:block absolute top-6 right-10 z-20">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-red-500/10 hover:text-red-400 text-slate-400 border border-white/5 rounded-xl transition-all duration-300 group"
                >
                  <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>

              <main className="p-4 sm:p-6 lg:p-10 overflow-y-auto flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dishes" element={<Dishes />} />
                  <Route path="/entry" element={<SalesEntry />} />
                  <Route path="/investors" element={<Investors />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/performance" element={<Performance />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </div>
        )}
      </AppProvider>
    </Router>
  );
}

export default App;

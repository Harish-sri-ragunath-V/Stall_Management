
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Menu, TrendingUp } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Dishes from './pages/Dishes';
import SalesEntry from './pages/Sales';
import Investors from './pages/Investors';
import Expenses from './pages/Expenses';
import Performance from './pages/Performance';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <AppProvider>
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
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-slate-400 hover:text-white p-2 bg-slate-900 rounded-lg border border-white/5 shadow-inner"
              >
                <Menu className="w-5 h-5" />
              </button>
            </header>

            <main className="p-4 sm:p-6 lg:p-10 overflow-y-auto flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dishes" element={<Dishes />} />
                <Route path="/entry" element={<SalesEntry />} />
                <Route path="/investors" element={<Investors />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/performance" element={<Performance />} />
              </Routes>
            </main>
          </div>
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;

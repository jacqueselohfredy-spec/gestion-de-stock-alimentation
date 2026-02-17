
import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, History, Bot, Store } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventaire', icon: Package },
    { id: 'pos', label: 'Caisse (Vente)', icon: ShoppingCart },
    { id: 'history', label: 'Historique', icon: History },
    { id: 'ai', label: 'Assistant IA', icon: Bot },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Store className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">AlimStock</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : ''}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 font-medium uppercase mb-1">Stock Critique</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-bold text-slate-700">3 articles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

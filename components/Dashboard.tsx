
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, AlertTriangle, Package, DollarSign } from 'lucide-react';
import { Product, Sale } from '../types';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);

  const chartData = [
    { name: 'Lun', sales: 400 },
    { name: 'Mar', sales: 300 },
    { name: 'Mer', sales: 600 },
    { name: 'Jeu', sales: 800 },
    { name: 'Ven', sales: 500 },
    { name: 'Sam', sales: 900 },
    { name: 'Dim', sales: 400 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Valeur de Stock" 
          value={`${totalStockValue.toLocaleString()} FCFA`} 
          icon={Package} 
          color="bg-blue-500" 
          subValue={`${products.length} références`}
        />
        <StatCard 
          title="Chiffre d'Affaires" 
          value={`${totalRevenue.toLocaleString()} FCFA`} 
          icon={TrendingUp} 
          color="bg-green-500"
          subValue="Derniers 30 jours"
        />
        <StatCard 
          title="Rupture Proche" 
          value={lowStockItems.length} 
          icon={AlertTriangle} 
          color="bg-amber-500"
          subValue="Articles à commander"
        />
        <StatCard 
          title="Profit Estimé" 
          value="45,000 FCFA" 
          icon={DollarSign} 
          color="bg-indigo-500"
          subValue="+12% vs mois dernier"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Évolution des Ventes</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Top Produits (Ventes)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {name: 'Pain', v: 400},
                {name: 'Sucre', v: 300},
                {name: 'Lait', v: 200},
                {name: 'Riz', v: 180},
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="v" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h4 className="text-lg font-bold text-slate-800">Alertes Stock</h4>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Produit</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Catégorie</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actuel</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Seuil</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">État</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lowStockItems.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{p.name}</td>
                <td className="px-6 py-4 text-slate-500">{p.category}</td>
                <td className="px-6 py-4 font-bold text-red-500">{p.stock}</td>
                <td className="px-6 py-4 text-slate-500">{p.minStock}</td>
                <td className="px-6 py-4">
                  <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-bold">Commander</span>
                </td>
              </tr>
            ))}
            {lowStockItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">Tout est en ordre ! Aucun produit en stock faible.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

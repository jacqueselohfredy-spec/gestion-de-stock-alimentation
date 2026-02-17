
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import POS from './components/POS';
import AIAssistant from './components/AIAssistant';
import { Product, Sale, AppView, SaleItem } from './types';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Pain Baguette', category: 'Boulangerie', price: 150, costPrice: 100, stock: 45, minStock: 20, unit: 'Unité', lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Lait Bonnet Rouge 400g', category: 'Crèmerie', price: 650, costPrice: 550, stock: 12, minStock: 15, unit: 'Boîte', lastUpdated: new Date().toISOString() },
  { id: '3', name: 'Riz Parfumé 5kg', category: 'Céréales', price: 4500, costPrice: 4000, stock: 8, minStock: 10, unit: 'Sac', lastUpdated: new Date().toISOString() },
  { id: '4', name: 'Sucre Granulé 1kg', category: 'Épicerie', price: 800, costPrice: 700, stock: 25, minStock: 10, unit: 'Paquet', lastUpdated: new Date().toISOString() },
  { id: '5', name: 'Huile Dinor 1.5L', category: 'Épicerie', price: 1700, costPrice: 1500, stock: 3, minStock: 5, unit: 'Bouteille', lastUpdated: new Date().toISOString() },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sales');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  const addProduct = (p: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...p,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString() } : p));
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleCompleteSale = (items: SaleItem[]) => {
    const total = items.reduce((acc, item) => acc + (item.priceAtSale * item.quantity), 0);
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      items,
      total,
      timestamp: new Date().toISOString()
    };

    // 1. Ajouter la vente à l'historique
    setSales(prevSales => [newSale, ...prevSales]);

    // 2. Mettre à jour les niveaux de stock
    setProducts(prevProducts => {
      const newProducts = [...prevProducts];
      items.forEach(saleItem => {
        const productIndex = newProducts.findIndex(p => p.id === saleItem.productId);
        if (productIndex !== -1) {
          const updatedProduct = {
            ...newProducts[productIndex],
            stock: Math.max(0, newProducts[productIndex].stock - saleItem.quantity),
            lastUpdated: new Date().toISOString()
          };
          newProducts[productIndex] = updatedProduct;
        }
      });
      return newProducts;
    });
    
    // Pas d'alerte système ici pour laisser le composant POS gérer l'affichage de succès
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              {currentView === 'dashboard' && "Tableau de bord"}
              {currentView === 'inventory' && "Gestion de l'inventaire"}
              {currentView === 'pos' && "Caisse & Encaissement"}
              {currentView === 'history' && "Historique des Ventes"}
              {currentView === 'ai' && "Assistant Intelligent"}
            </h2>
            <p className="text-slate-500 font-medium">Gestion intelligente de votre alimentation.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recette du jour</span>
                <span className="text-lg font-black text-indigo-600">
                  {sales.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString())
                       .reduce((acc, s) => acc + s.total, 0).toLocaleString()} <span className="text-xs">FCFA</span>
                </span>
             </div>
             <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                AD
             </div>
          </div>
        </header>

        {currentView === 'dashboard' && <Dashboard products={products} sales={sales} />}
        {currentView === 'inventory' && (
          <Inventory 
            products={products} 
            onAdd={addProduct} 
            onUpdate={updateProduct} 
            onDelete={deleteProduct} 
          />
        )}
        {currentView === 'pos' && <POS products={products} onCompleteSale={handleCompleteSale} />}
        {currentView === 'ai' && <AIAssistant products={products} salesHistory={sales} />}
        {currentView === 'history' && (
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Vente</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Articles</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Heure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sales.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-400">#{s.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {s.items.length} {s.items.length > 1 ? 'articles' : 'article'}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-indigo-600">{s.total.toLocaleString()} FCFA</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{new Date(s.timestamp).toLocaleString('fr-FR')}</td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Aucune vente enregistrée.</td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;

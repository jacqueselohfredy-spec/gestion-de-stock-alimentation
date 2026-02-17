
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X } from 'lucide-react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onAdd: (p: Omit<Product, 'id' | 'lastUpdated'>) => void;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onDelete: (id: string) => void;
}

const PREDEFINED_CATEGORIES = [
  'Boulangerie',
  'Crèmerie',
  'Céréales',
  'Épicerie',
  'Boissons',
  'Produits Frais',
  'Hygiène & Beauté',
  'Entretien Maison',
  'Snacks & Biscuits',
  'Surgelés',
  'Conserves',
  'Divers'
];

const Inventory: React.FC<InventoryProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    minStock: 5,
    unit: 'Unité'
  });

  // Synchroniser le formulaire quand on commence une édition
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        costPrice: editingProduct.costPrice,
        stock: editingProduct.stock,
        minStock: editingProduct.minStock,
        unit: editingProduct.unit
      });
      setIsModalOpen(true);
    }
  }, [editingProduct]);

  const availableCategories = useMemo(() => {
    const existingCategories = products.map(p => p.category);
    const combined = [...PREDEFINED_CATEGORIES, ...existingCategories];
    return Array.from(new Set(combined)).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdate(editingProduct.id, formData);
    } else {
      onAdd(formData);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: 0, costPrice: 0, stock: 0, minStock: 5, unit: 'Unité' });
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un produit ou une catégorie..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" /> Filtrer
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus className="w-5 h-5" /> Nouveau Produit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produit</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Prix de Vente</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dernière Mise à Jour</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{p.name}</div>
                  <div className="text-xs text-slate-400">ID: {p.id.slice(0, 8)}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">{p.category}</span>
                </td>
                <td className="px-6 py-4 font-medium text-indigo-600">{p.price.toLocaleString()} FCFA</td>
                <td className="px-6 py-4">
                  <div className={`text-sm font-bold ${p.stock <= p.minStock ? 'text-red-500' : 'text-slate-700'}`}>
                    {p.stock} {p.unit}
                  </div>
                  {p.stock <= p.minStock && (
                    <div className="text-[10px] text-red-400 font-bold uppercase">Stock Faible</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(p.lastUpdated).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditClick(p)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-indigo-100 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(p.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Aucun produit trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom du produit</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ex: Sac de Riz 50kg"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                  <input 
                    required
                    type="text" 
                    list="category-suggestions"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Choisir ou saisir..."
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                  <datalist id="category-suggestions">
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unité</label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  >
                    <option value="Unité">Unité</option>
                    <option value="Kg">Kilogramme (Kg)</option>
                    <option value="Litre">Litre (L)</option>
                    <option value="Carton">Carton</option>
                    <option value="Sac">Sac</option>
                    <option value="Paquet">Paquet</option>
                    <option value="Boîte">Boîte</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prix d'Achat (FCFA)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prix de Vente (FCFA)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Seuil d'Alerte</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  {editingProduct ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

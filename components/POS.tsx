
import React, { useState } from 'react';
import { ShoppingCart, Search, Trash2, CheckCircle, CreditCard, Banknote, ArrowRight, RefreshCcw } from 'lucide-react';
import { Product, SaleItem } from '../types';

interface POSProps {
  products: Product[];
  onCompleteSale: (items: SaleItem[]) => void;
}

const POS: React.FC<POSProps> = ({ products, onCompleteSale }) => {
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile' | null>(null);
  const [lastTotal, setLastTotal] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        // Ne pas dépasser le stock disponible
        if (existing.quantity >= product.stock) {
          alert("Stock insuffisant pour ce produit !");
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0 || !paymentMethod) return;
    
    const saleItems: SaleItem[] = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      priceAtSale: item.product.price
    }));
    
    onCompleteSale(saleItems);
    setLastTotal(total);
    setCart([]);
    setPaymentMethod(null);
    setShowSuccess(true);
  };

  const resetSale = () => {
    setShowSuccess(false);
    setLastTotal(null);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-3xl border border-slate-100 shadow-xl p-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Vente Encaissée !</h2>
        <p className="text-slate-500 mb-8 text-lg">Le montant de <span className="font-bold text-indigo-600">{lastTotal?.toLocaleString()} FCFA</span> a été ajouté à la caisse.</p>
        <button 
          onClick={resetSale}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <RefreshCcw className="w-5 h-5" /> Nouvelle Vente
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Sélection des Produits */}
      <div className="lg:col-span-2 space-y-4 flex flex-col min-h-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un produit (Nom ou Catégorie)..."
            className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {filteredProducts.map(p => (
            <button
              key={p.id}
              disabled={p.stock <= 0}
              onClick={() => addToCart(p)}
              className={`p-4 bg-white border border-slate-100 rounded-2xl text-left transition-all hover:shadow-lg hover:scale-[1.02] flex flex-col justify-between group ${p.stock <= 0 ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'active:scale-95'}`}
            >
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{p.category}</p>
                <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-indigo-600 text-sm">{p.name}</h4>
              </div>
              <div className="mt-4">
                <p className="text-lg font-black text-indigo-600">{p.price.toLocaleString()} <span className="text-[10px]">FCFA</span></p>
                <div className={`mt-1 flex items-center gap-1 text-[10px] font-bold uppercase ${p.stock <= p.minStock ? 'text-red-500' : 'text-slate-400'}`}>
                   <span className={`w-1.5 h-1.5 rounded-full ${p.stock <= p.minStock ? 'bg-red-500' : 'bg-slate-300'}`}></span>
                   {p.stock <= 0 ? 'Rupture' : `Stock: ${p.stock} ${p.unit}`}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Panier et Encaissement */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl flex flex-col overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Panier</h3>
          </div>
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">{cart.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50 py-12">
              <ShoppingCart className="w-16 h-16 stroke-1" />
              <p className="font-medium text-center text-sm">Panier vide</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group animate-in slide-in-from-right-2 duration-200">
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{item.product.name}</p>
                  <p className="text-xs text-slate-500">{item.quantity} x {item.product.price.toLocaleString()} FCFA</p>
                </div>
                <div className="flex items-center gap-3">
                   <p className="font-bold text-indigo-700 text-sm">{(item.quantity * item.product.price).toLocaleString()}</p>
                   <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                   >
                    <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-white border-t border-slate-100 space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Méthode de Paiement</label>
            <div className="grid grid-cols-2 gap-3">
               <button 
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center gap-2 p-3 border-2 rounded-2xl transition-all ${
                  paymentMethod === 'cash' 
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
               >
                  <Banknote className="w-6 h-6" />
                  <span className="text-[10px] font-bold">Espèces</span>
               </button>
               <button 
                onClick={() => setPaymentMethod('mobile')}
                className={`flex flex-col items-center gap-2 p-3 border-2 rounded-2xl transition-all ${
                  paymentMethod === 'mobile' 
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
               >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-[10px] font-bold">Mobile Money</span>
               </button>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center text-slate-500 text-xs mb-1">
              <span>Sous-total</span>
              <span>{total.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-800">Total</span>
              <span className="text-2xl font-black text-indigo-600">{total.toLocaleString()} FCFA</span>
            </div>
          </div>
          
          <button 
            disabled={cart.length === 0 || !paymentMethod}
            onClick={handleCheckout}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-xl ${
              (cart.length === 0 || !paymentMethod)
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-95'
            }`}
          >
            {!paymentMethod && cart.length > 0 ? "CHOISIR LE PAIEMENT" : "VALIDER L'ENCAISSEMENT"}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;

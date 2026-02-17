
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Product } from '../types';
import { analyzeInventoryWithGemini, suggestStockAdjustments } from '../services/geminiService';

interface AIAssistantProps {
  products: Product[];
  salesHistory: any[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ products, salesHistory }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Bonjour ! Je suis votre assistant AlimStock. Posez-moi des questions sur votre inventaire ou demandez-moi une analyse des ventes." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const botResponse = await analyzeInventoryWithGemini(products, userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: botResponse || "Désolé, j'ai rencontré une erreur." }]);
    setLoading(false);
  };

  const loadSuggestions = async () => {
    setLoading(true);
    const result = await suggestStockAdjustments(products, salesHistory);
    setSuggestions(result.suggestions || []);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      <div className="lg:col-span-2 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-6 bg-indigo-600 text-white flex items-center gap-3">
          <Bot className="w-8 h-8" />
          <div>
            <h3 className="font-bold">Assistant AlimStock IA</h3>
            <p className="text-xs text-indigo-100">Propulsé par Gemini 3 Flash</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'}`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
          <input 
            type="text" 
            placeholder="Posez une question sur le stock..."
            className="flex-1 px-5 py-3 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none border border-transparent focus:border-indigo-100 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-slate-800">Recommandations</h4>
            </div>
            <button 
              onClick={loadSuggestions}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="space-y-4">
            {suggestions.length > 0 ? (
              suggestions.map((s, i) => (
                <div key={i} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                  <p className="font-bold text-amber-900 text-sm">{s.productName}</p>
                  <p className="text-xs text-amber-700 mt-1">{s.reason}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-amber-500">Conseil : +{s.recommendedQuantity}</span>
                    <button className="text-[10px] font-bold bg-amber-200 px-2 py-1 rounded text-amber-800">Commander</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 italic text-sm">
                Appuyez sur rafraîchir pour obtenir des suggestions intelligentes.
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
           <h4 className="font-bold mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" /> 
              Exemples de questions
           </h4>
           <div className="space-y-2">
              {[
                "Quels produits sont bientôt épuisés ?",
                "Quel est le produit le plus rentable ?",
                "Combien vaut mon stock total actuel ?",
                "Analyse mes ventes de la semaine dernière."
              ].map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => setInput(q)}
                  className="w-full text-left text-xs p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  {q}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

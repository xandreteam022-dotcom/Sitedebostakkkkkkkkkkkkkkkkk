
import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import DonationModal from './components/DonationModal';
import { Product } from './types';

const ADMIN_PASS = "SAOMATEUS2025";
const STORAGE_KEY = "geriatrica_sao_mateus_v4";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<'home' | 'admin' | 'login'>('home');
  const [password, setPassword] = useState('');
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  // Carregar dados
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar do banco local", e);
      }
    }
  }, []);

  // Salvar dados
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt' | 'link'>) => {
    const p: Product = {
      ...newProd,
      id: Date.now().toString(),
      createdAt: Date.now(),
      link: "" // Reservado para links futuros
    };
    setProducts([p, ...products]);
    setView('home');
  };

  const deleteProduct = (id: string) => {
    if(confirm("Tem certeza que deseja remover este item?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toUpperCase() === ADMIN_PASS) {
      setView('admin');
      setPassword('');
    } else {
      alert("Chave de acesso inválida!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Modal de Doação */}
      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={() => setIsDonationModalOpen(false)} 
      />

      {/* Faixa Superior Institucional */}
      <div className="h-1.5 bg-gradient-to-r from-green-800 via-yellow-400 to-green-800"></div>

      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setView('home')}
          >
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform">
              <i className="fas fa-heart"></i>
            </div>
            <div>
              <h1 className="font-heading font-black text-green-900 text-lg leading-none tracking-tighter">
                CASA GERIÁTRICA
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">São Mateus</p>
            </div>
          </div>

          <button 
            onClick={() => setView(view === 'home' ? 'login' : 'home')}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-green-700 transition-colors"
          >
            {view === 'home' ? <><i className="fas fa-lock mr-2"></i>Área Restrita</> : 'Voltar ao Site'}
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {view === 'home' && (
          <>
            {/* Hero Section */}
            <section className="hero-section py-24 px-6 text-white text-center">
              <div className="max-w-4xl mx-auto">
                <span className="inline-block bg-yellow-400 text-green-900 text-[10px] font-black px-5 py-2 rounded-full mb-8 uppercase tracking-widest shadow-xl">
                  Seja a luz na vida de alguém
                </span>
                <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 leading-[1.1]">
                  Cuidando com Amor <br/>e <span className="text-yellow-400">Dignidade</span>.
                </h2>
                <p className="text-lg md:text-xl text-green-50/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Conheça nossas necessidades atuais e ajude a manter o sorriso no rosto de nossos residentes.
                </p>
                <button 
                  onClick={() => setIsDonationModalOpen(true)}
                  className="btn-gradient px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs inline-block shadow-2xl"
                >
                  Quero Contribuir
                </button>
              </div>
            </section>

            {/* Listagem de Itens */}
            <section id="doacoes" className="max-w-7xl mx-auto py-24 px-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b pb-8">
                <div>
                  <h3 className="font-heading font-black text-3xl text-gray-800 tracking-tighter">NECESSIDADES URGENTES</h3>
                  <p className="text-gray-400 font-medium mt-2">Clique em "Ajudar" para saber como doar este item.</p>
                </div>
                <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-widest">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  Atualizado Hoje
                </div>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                  <i className="fas fa-leaf text-gray-200 text-5xl mb-6"></i>
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.3em]">Nenhuma campanha ativa no momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {view === 'login' && (
          <div className="max-w-md mx-auto py-32 px-6">
            <div className="bg-white p-12 rounded-[3rem] custom-shadow border border-gray-50 text-center">
              <div className="w-20 h-20 bg-green-50 text-green-700 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-inner">
                <i className="fas fa-key"></i>
              </div>
              <h2 className="text-2xl font-heading font-black text-gray-800 mb-8 uppercase tracking-tighter">Painel de Controle</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="DIGITE A CHAVE MESTRA" 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-5 px-6 outline-none focus:border-green-600 transition-all text-center font-bold tracking-widest text-lg"
                  autoFocus
                />
                <button className="w-full btn-gradient text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">
                  Entrar no Sistema
                </button>
              </form>
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div className="max-w-7xl mx-auto py-12 px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <AdminPanel onAddProduct={addProduct} />
              </div>
              <div className="lg:col-span-7">
                <div className="bg-white rounded-[3rem] p-10 custom-shadow border border-gray-50">
                  <h3 className="font-heading font-bold text-gray-800 mb-10 flex items-center gap-3 uppercase text-xs tracking-widest border-b pb-6">
                    <i className="fas fa-tasks text-green-600"></i> Gestão de Postagens
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {products.map(p => (
                      <div key={p.id} className="group relative aspect-square bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100">
                        <img src={p.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                          <p className="text-white font-bold mb-6 uppercase text-xs tracking-tight">{p.name}</p>
                          <button 
                            onClick={() => deleteProduct(p.id)}
                            className="bg-white text-red-600 w-14 h-14 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-90"
                          >
                            <i className="fas fa-trash-alt text-xl"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <div className="col-span-full py-20 text-center text-gray-300 font-bold uppercase text-[10px] tracking-[0.3em]">
                        Sem itens para gerenciar.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-10 mb-12">
            <a href="#" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-700 transition-all text-xl shadow-sm">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-700 transition-all text-xl shadow-sm">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-700 transition-all text-xl shadow-sm">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
          <p className="text-primary font-black text-[11px] uppercase tracking-[0.5em] mb-4">Casa Geriátrica São Mateus</p>
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">© 2025 Dedicação Integral ao Bem Estar do Idoso</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

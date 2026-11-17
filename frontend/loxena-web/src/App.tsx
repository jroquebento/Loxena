import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { LocationsPage } from './pages/LocationsPage'; 
import { StocksPage } from './pages/StocksPage';
import { CustomersPage } from './pages/CustomersPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { CreateOrderPage } from './pages/CreateOrderPage';

function Sidebar({ aberta, aoNavegar }: { aberta: boolean; aoNavegar: () => void }) {
  const location = useLocation(); 

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-blue-900 text-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${aberta ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 text-2xl font-bold border-b border-blue-800 text-center">
        Loxena
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-2 mt-4">
        <Link 
          to="/" 
          onClick={aoNavegar}
          className={`p-3 rounded-md transition ${isActive('/') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
          📦 Produtos
        </Link>
        <Link 
          to="/categorias" 
          onClick={aoNavegar}
          className={`p-3 rounded-md transition ${isActive('/categorias') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
          🏷️ Categorias
        </Link>
        <Link 
          to="/localizacoes" 
          onClick={aoNavegar}
          className={`p-3 rounded-md transition ${isActive('/localizacoes') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
          📍 Localizações
        </Link>
        <Link 
        to="/estoque" 
        onClick={aoNavegar}
        className={`p-3 rounded-md transition ${isActive('/estoque') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
        📊 Saldo de Estoque
        </Link>
        <Link 
          to="/clientes" 
          onClick={aoNavegar}
          className={`p-3 rounded-md transition ${isActive('/clientes') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
          ⭐ Clientes
        </Link>
        <Link 
        to="/pedidos" 
        onClick={aoNavegar}
        className={`p-3 rounded-md transition ${isActive('/pedidos') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
        📋 Pedidos
        </Link>
      </nav>
    </aside>
  );
}

export default function App() {
  const [menuAberto, definirMenuAberto] = useState(false);

  useEffect(() => {
    if (!menuAberto) return;

    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') definirMenuAberto(false);
    };

    window.addEventListener('keydown', fecharComEscape);
    return () => window.removeEventListener('keydown', fecharComEscape);
  }, [menuAberto]);

  return (
    <BrowserRouter>
      <div className="flex h-dvh min-h-screen overflow-hidden bg-gray-100">
        {menuAberto && (
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => definirMenuAberto(false)}
          />
        )}

        <Sidebar aberta={menuAberto} aoNavegar={() => definirMenuAberto(false)} />

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
            <button
              type="button"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuAberto}
              onClick={() => definirMenuAberto(!menuAberto)}
              className="rounded-md p-2 text-blue-900 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <span className="block h-0.5 w-6 bg-current" />
              <span className="mt-1.5 block h-0.5 w-6 bg-current" />
              <span className="mt-1.5 block h-0.5 w-6 bg-current" />
            </button>
            <span className="text-lg font-bold text-blue-900">Loxena</span>
          </header>
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/localizacoes" element={<LocationsPage />} />
            <Route path="/estoque" element={<StocksPage />} />
            <Route path="/clientes" element={<CustomersPage />} />
            <Route path="/pedidos" element={<OrdersPage />} />
            <Route path="/pedidos/operar/:id" element={<OrderDetailsPage />} />
            <Route path="/pedidos/novo" element={<CreateOrderPage />} />
          </Routes>
        </main>
        
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  );
}
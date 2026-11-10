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

function Sidebar() {
  const location = useLocation(); 

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col shadow-xl">
      <div className="p-6 text-2xl font-bold border-b border-blue-800 text-center">
        Loxena
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-2 mt-4">
        <Link 
          to="/" 
          className={`p-3 rounded-md transition ${isActive('/') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
          📦 Produtos
        </Link>
        <Link 
          to="/categorias" 
          className={`p-3 rounded-md transition ${isActive('/categorias') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
          🏷️ Categorias
        </Link>
        <Link 
          to="/localizacoes" 
          className={`p-3 rounded-md transition ${isActive('/localizacoes') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
          📍 Localizações
        </Link>
        <Link 
        to="/estoque" 
        className={`p-3 rounded-md transition ${isActive('/estoque') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
        📊 Saldo de Estoque
        </Link>
        <Link 
          to="/clientes" 
          className={`p-3 rounded-md transition ${isActive('/clientes') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
          ⭐ Clientes
        </Link>
        <Link 
        to="/pedidos" 
        className={`p-3 rounded-md transition ${isActive('/pedidos') ? 'bg-blue-700 font-bold' : 'hover:bg-blue-800'}`}
        >
        📋 Pedidos
        </Link>
      </nav>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
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
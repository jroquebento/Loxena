import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';

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
          </Routes>
        </main>
        
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  );
}
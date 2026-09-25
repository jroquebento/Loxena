import { useState, useEffect } from 'react';
import type { Product } from './types/Product';
import type { Category } from './types/Category';
import { productService } from './services/productService';
import { categoryService } from './services/categoryService';

export default function App() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
 

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const carregarDados = () => {
    productService.getAll().then(dados => setProdutos(dados)).catch(erro => console.error(erro));
    categoryService.getAll().then(dados => setCategorias(dados)).catch(erro => console.error(erro));
  };
 
  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvar = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const precoNumero = parseFloat(preco);

    productService.create(nome, descricao, precoNumero, categoryId)
      .then(() => {
        setNome('')
        setDescricao('');
        setPreco('');
        setCategoryId('');
        carregarDados();
      })
      .catch(erro => console.error("Erro ao salvar:",erro));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">
          Painel Loxena
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Novo Produto</h2>
          
          <form onSubmit={handleSalvar} className="flex flex-col gap-4">
            
            <input 
              type="text" 
              placeholder="Nome do Produto" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <textarea 
              placeholder="Descrição do Produto" 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />

            <div className="grid grid-cols-2 gap-4">
              <input 
                type="number" 
                placeholder="Preço (ex: 50.50)" 
                value={preco} 
                onChange={(e) => setPreco(e.target.value)} 
                step="0.01"
                required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)} 
                required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>Selecione uma Categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-2"
            >
              Cadastrar Produto
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Produtos Cadastrados</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {produtos.length} itens
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {produtos.map((produto) => (
              
              <div key={produto.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                <h3 className="font-bold text-lg text-gray-800">{produto.name}</h3>
                <p className="text-green-600 font-bold text-xl mt-2">
                  R$ {produto.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
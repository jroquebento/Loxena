import { useState } from 'react';
import type { Category } from '../types/Category';
import type { Product } from '../types/Product';

interface ProductFormProps {
  categorias: Category[];
  onSalvar: (nome: string, descricao: string, preco: number, categoryId: string) => void;
  produtoSelecionado?: Product | null; 
  onCancelar?: () => void;
}

export function ProductForm({ categorias, onSalvar, produtoSelecionado, onCancelar }: ProductFormProps) {
  const [nome, setNome] = useState(produtoSelecionado?.name || '');
  const [descricao, setDescricao] = useState(produtoSelecionado?.description || '');
  const [preco, setPreco] = useState(produtoSelecionado ? produtoSelecionado.price.toString() : '');
  const [categoryId, setCategoryId] = useState(produtoSelecionado?.categoryId || '');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const precoNumero = parseFloat(preco);
    
    onSalvar(nome, descricao, precoNumero, categoryId);

    if(!produtoSelecionado) {
      setNome('');
      setDescricao('');
      setPreco('');
      setCategoryId('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {produtoSelecionado ? 'Editar Produto' : 'Novo Produto'}
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="text" placeholder="Nome do Produto" required
          value={nome} onChange={(e) => setNome(e.target.value)} 
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <textarea 
          placeholder="Descrição do Produto" 
          value={descricao} onChange={(e) => setDescricao(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
        />

        <div className="grid grid-cols-2 gap-4">
          <input 
            type="number" placeholder="Preço (ex: 50.50)" step="0.01" required
            value={preco} onChange={(e) => setPreco(e.target.value)} 
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select 
            value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="" disabled>Selecione uma Categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>


        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition flex-1">
            {produtoSelecionado ? 'Atualizar Produto' : 'Cadastrar Produto'}
          </button>
          
          {produtoSelecionado && onCancelar && (
            <button type="button" onClick={onCancelar} className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition w-1/3">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

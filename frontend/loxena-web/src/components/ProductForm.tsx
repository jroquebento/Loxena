import { useState } from 'react';
import { toast } from 'react-toastify';
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

    const nomeLimpo = nome.trim();
    const precoNumero = Number(preco);

    if (!nomeLimpo) {
      toast.warn('Informe o nome do produto.');
      return;
    }
    if (nomeLimpo.length > 200) {
      toast.warn('O nome do produto não pode exceder 200 caracteres.');
      return;
    }
    if (descricao.trim().length > 2000) {
      toast.warn('A descrição não pode exceder 2000 caracteres.');
      return;
    }
    if (!preco.trim() || !Number.isFinite(precoNumero) || precoNumero < 0) {
      toast.warn('Informe um preço válido, igual ou maior que zero.');
      return;
    }
    if (!categoryId) {
      toast.warn('Selecione uma categoria.');
      return;
    }

    onSalvar(nomeLimpo, descricao.trim(), precoNumero, categoryId);

    if(!produtoSelecionado) {
      setNome('');
      setDescricao('');
      setPreco('');
      setCategoryId('');
    }
  };

  return (
    <div className="mb-8 rounded-lg bg-white p-4 shadow-md sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {produtoSelecionado ? 'Editar Produto' : 'Novo Produto'}
      </h2>
      <p className="text-sm text-gray-500 mb-4">* Campos obrigatórios</p>
      
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <input 
          type="text" placeholder="Nome do Produto *" required maxLength={200}
          value={nome} onChange={(e) => setNome(e.target.value)} 
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <textarea 
          placeholder="Descrição do Produto" 
          value={descricao} onChange={(e) => setDescricao(e.target.value)}
          className="min-h-[100px] w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input 
            type="number" placeholder="Preço (ex: 50.50) *" min="0" step="0.01" required
            value={preco} onChange={(e) => setPreco(e.target.value)} 
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select 
            value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
            className="w-full rounded-md border border-gray-300 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecione uma Categoria *</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>


        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <button type="submit" className="w-full flex-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 sm:w-auto">
            {produtoSelecionado ? 'Atualizar Produto' : 'Cadastrar Produto'}
          </button>
          
          {produtoSelecionado && onCancelar && (
            <button type="button" onClick={onCancelar} className="w-full rounded-md bg-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-400 sm:w-1/3">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

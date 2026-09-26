import { useState } from 'react';
import type { Category } from '../types/Category';

interface CategoryFormProps {
  onSalvar: (nome: string) => void;
  categoriaSelecionada?: Category | null;
  onCancelar?: () => void;
}

export function CategoryForm({ onSalvar, categoriaSelecionada, onCancelar }: CategoryFormProps) {
  const [nome, setNome] = useState(categoriaSelecionada?.name || '');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSalvar(nome);

    if (!categoriaSelecionada) {
      setNome('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {categoriaSelecionada ? 'Editar Categoria' : 'Nova Categoria'}
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="text" placeholder="Nome da Categoria (ex: Eletrônicos)" required
          value={nome} onChange={(e) => setNome(e.target.value)} 
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition flex-1">
            {categoriaSelecionada ? 'Atualizar Categoria' : 'Cadastrar Categoria'}
          </button>
          
          {categoriaSelecionada && onCancelar && (
            <button type="button" onClick={onCancelar} className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition w-1/3">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
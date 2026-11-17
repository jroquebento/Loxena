import { useState } from 'react';
import { toast } from 'react-toastify';
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
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      toast.warn('Informe o nome da categoria.');
      return;
    }
    if (nomeLimpo.length > 100) {
      toast.warn('O nome da categoria não pode exceder 100 caracteres.');
      return;
    }

    onSalvar(nomeLimpo);

    if (!categoriaSelecionada) {
      setNome('');
    }
  };

  return (
    <div className="mb-8 rounded-lg bg-white p-4 shadow-md sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {categoriaSelecionada ? 'Editar Categoria' : 'Nova Categoria'}
      </h2>
      <p className="text-sm text-gray-500 mb-4">* Campos obrigatórios</p>
      
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <input 
          type="text" placeholder="Nome da Categoria (ex: Eletrônicos) *" required maxLength={100}
          value={nome} onChange={(e) => setNome(e.target.value)} 
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <button type="submit" className="w-full flex-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 sm:w-auto">
            {categoriaSelecionada ? 'Atualizar Categoria' : 'Cadastrar Categoria'}
          </button>
          
          {categoriaSelecionada && onCancelar && (
            <button type="button" onClick={onCancelar} className="w-full rounded-md bg-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-400 sm:w-1/3">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
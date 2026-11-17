import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Location } from '../types/Location';

interface LocationFormProps {
  onSalvar: (code: string, description: string) => void;
  locationSelecionada?: Location | null;
  onCancelar?: () => void;
}

export function LocationForm({ onSalvar, locationSelecionada, onCancelar }: LocationFormProps) {
  const [code, setCode] = useState(locationSelecionada?.code || '');
  const [description, setDescription] = useState(locationSelecionada?.description || '');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const codeLimpo = code.trim();
    const descriptionLimpa = description.trim();
    if (!codeLimpo) {
      toast.warn('Informe o código da localização.');
      return;
    }
    if (codeLimpo.length > 50) {
      toast.warn('O código da localização não pode exceder 50 caracteres.');
      return;
    }
    if (!descriptionLimpa) {
      toast.warn('Informe a descrição da localização.');
      return;
    }
    if (descriptionLimpa.length > 500) {
      toast.warn('A descrição não pode exceder 500 caracteres.');
      return;
    }

    onSalvar(codeLimpo, descriptionLimpa);

    if (!locationSelecionada) {
      setCode('');
      setDescription('');
    }
  };

  return (
    <div className="mb-8 rounded-lg bg-white p-4 shadow-md sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {locationSelecionada ? 'Editar Localização' : 'Nova Localização'}
      </h2>
      <p className="text-sm text-gray-500 mb-4">* Campos obrigatórios</p>
      
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Código (ex: A-01) *" 
          required
          maxLength={50}
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input 
          type="text" 
          placeholder="Descrição (ex: Corredor A, Prateleira 1) *" 
          required
          maxLength={500}
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <button type="submit" className="w-full flex-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 sm:w-auto">
            {locationSelecionada ? 'Atualizar Localização' : 'Cadastrar Localização'}
          </button>
          
          {locationSelecionada && onCancelar && (
            <button type="button" onClick={onCancelar} className="w-full rounded-md bg-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-400 sm:w-1/3">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
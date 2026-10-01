import { useState } from 'react';
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
    onSalvar(code, description);

    if (!locationSelecionada) {
      setCode('');
      setDescription('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {locationSelecionada ? 'Editar Localização' : 'Nova Localização'}
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Código (ex: A-01)" 
          required
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input 
          type="text" 
          placeholder="Descrição (ex: Corredor A, Prateleira 1)" 
          required
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition flex-1">
            {locationSelecionada ? 'Atualizar Localização' : 'Cadastrar Localização'}
          </button>
          
          {locationSelecionada && onCancelar && (
            <button type="button" onClick={onCancelar} className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition w-1/3">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
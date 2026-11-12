import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Product } from '../types/Product';
import type { Location } from '../types/Location';

interface StockFormProps {
  onMovimentar: (tipo: 'entrada' | 'saida', productId: string, locationId: string, amount: number) => void;
  produtos: Product[];
  localizacoes: Location[];
  preSelecao?: { productId: string; locationId: string } | null;
  onLimparSelecao: () => void;
}

export function StockForm({ onMovimentar, produtos, localizacoes, preSelecao, onLimparSelecao }: StockFormProps) {
  const [productId, setProductId] = useState(preSelecao?.productId || '');
  const [locationId, setLocationId] = useState(preSelecao?.locationId || '');
  const [amount, setAmount] = useState<number | ''>('');

  const validar = () => {
    if (!productId) {
      toast.warn('Selecione um produto.');
      return false;
    }
    if (!locationId) {
      toast.warn('Selecione uma localização.');
      return false;
    }
    if (amount === '' || !Number.isInteger(amount) || amount <= 0) {
      toast.warn('Informe uma quantidade inteira maior que zero.');
      return false;
    }
    return true;
  };

  const handleEntrada = () => {
    if (validar()) onMovimentar('entrada', productId, locationId, Number(amount));
  };

  const handleSaida = () => {
    if (validar()) onMovimentar('saida', productId, locationId, Number(amount));
  };

  const handleCancelar = () => {
    setProductId('');
    setLocationId('');
    setAmount('');
    onLimparSelecao();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Movimentação de Estoque</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 font-medium mb-1">Produto</label>
          <select 
            value={productId} 
            onChange={(e) => setProductId(e.target.value)} 
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecione um Produto...</option>
            {produtos.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 font-medium mb-1">Localização</label>
          <select 
            value={locationId} 
            onChange={(e) => setLocationId(e.target.value)} 
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecione uma Localização...</option>
            {localizacoes.map(l => <option key={l.id} value={l.id}>{l.code} - {l.description}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 font-medium mb-1">Quantidade</label>
          <input 
            type="number" 
            min="1"
            step="1"
            value={amount} 
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} 
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 10"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={handleEntrada} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition flex-1">
          + Dar Entrada
        </button>
        <button type="button" onClick={handleSaida} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition flex-1">
          - Dar Baixa
        </button>
        {(productId || locationId || amount !== '') && (
          <button type="button" onClick={handleCancelar} className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition w-1/4">
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
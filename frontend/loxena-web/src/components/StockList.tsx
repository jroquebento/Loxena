import type { Stock } from '../types/Stock';
import type { Product } from '../types/Product';
import type { Location } from '../types/Location';

interface StockListProps {
  stocks: Stock[];
  produtos: Product[];
  localizacoes: Location[];
  onSelecionarParaMovimento: (productId: string, locationId: string) => void;
  onSelecionarParaTransferencia: (productId: string, locationId: string, maxQuantity: number) => void;
}

export function StockList({ stocks, produtos, localizacoes, onSelecionarParaMovimento, onSelecionarParaTransferencia }: StockListProps) {
  const getProdutoNome = (id: string) => produtos.find(p => p.id === id)?.name || 'Desconhecido';
  const getLocalizacaoCodigo = (id: string) => localizacoes.find(l => l.id === id)?.code || 'Desconhecido';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Saldo de Estoque</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {stocks.length} registros
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Físico</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Reservado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Disponível</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Estoque vazio.</td></tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getProdutoNome(stock.productId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getLocalizacaoCodigo(stock.locationId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">{stock.physicalQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-orange-600 font-semibold">{stock.reservedQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-bold">{stock.availableQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button 
                      onClick={() => {
                        onSelecionarParaMovimento(stock.productId, stock.locationId);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md"
                    >
                      Movimentar
                    </button>
                    <button
                      onClick = {() => {
                        onSelecionarParaTransferencia(stock.productId, stock.locationId, stock.physicalQuantity);

                      }}
                      className="text-purple-600 hover:text-purple-900 bg-purple-50 px-3 py-1 rounded-md"
                    >
                      Transferir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
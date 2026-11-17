import { useState } from 'react';
import type { Stock } from '../types/Stock';
import type { Product } from '../types/Product';
import type { Location } from '../types/Location';
import { SearchInput } from './SearchInput';
import { normalizeSearchText } from '../utils/searchUtils';

interface StockListProps {
  stocks: Stock[];
  produtos: Product[];
  localizacoes: Location[];
  onSelecionarParaMovimento: (productId: string, locationId: string) => void;
  onSelecionarParaTransferencia: (productId: string, locationId: string, maxQuantity: number) => void;
}

export function StockList({ stocks, produtos, localizacoes, onSelecionarParaMovimento, onSelecionarParaTransferencia }: StockListProps) {
  const [valorBusca, definirValorBusca] = useState('');
  const buscaNormalizada = normalizeSearchText(valorBusca);
  const getProdutoNome = (id: string) => produtos.find(p => p.id === id)?.name || 'Desconhecido';
  const getLocalizacaoCodigo = (id: string) => localizacoes.find(l => l.id === id)?.code || 'Desconhecido';
  const getLocalizacaoDescricao = (id: string) => localizacoes.find(l => l.id === id)?.description || '';
  const stocksComSaldo = stocks.filter(stock => stock.physicalQuantity > 0);
  const stocksFiltrados = stocksComSaldo.filter((stock) =>
    normalizeSearchText(getProdutoNome(stock.productId)).includes(buscaNormalizada) ||
    normalizeSearchText(`${getLocalizacaoCodigo(stock.locationId)} ${getLocalizacaoDescricao(stock.locationId)}`).includes(buscaNormalizada)
  );

  return (
    <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-700">Saldo de Estoque</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {stocksFiltrados.length} registros
        </span>
      </div>

      <SearchInput
        valor={valorBusca}
        aoAlterar={definirValorBusca}
        placeholder="Buscar por produto ou localização..."
      />

      <div className="hidden overflow-x-auto md:block">
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
            {stocksFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  {stocksComSaldo.length === 0 ? 'Nenhum estoque com saldo físico.' : 'Nenhum estoque corresponde à busca.'}
                </td>
              </tr>
            ) : (
              stocksFiltrados.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getProdutoNome(stock.productId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getLocalizacaoCodigo(stock.locationId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">{stock.physicalQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-orange-600 font-semibold">{stock.reservedQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-bold">{stock.availableQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex flex-col gap-2 sm:flex-row">
                    <button 
                      onClick={() => {
                        onSelecionarParaMovimento(stock.productId, stock.locationId);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      className="w-full rounded-md bg-blue-50 px-3 py-1 text-blue-600 hover:text-blue-900 sm:w-auto"
                    >
                      Movimentar
                    </button>
                    <button
                      onClick = {() => {
                        onSelecionarParaTransferencia(stock.productId, stock.locationId, stock.physicalQuantity);

                      }}
                      className="w-full rounded-md bg-purple-50 px-3 py-1 text-purple-600 hover:text-purple-900 sm:w-auto"
                    >
                      Transferir
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {stocksFiltrados.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            {stocksComSaldo.length === 0 ? 'Nenhum estoque com saldo físico.' : 'Nenhum estoque corresponde à busca.'}
          </p>
        ) : (
          stocksFiltrados.map((stock) => (
            <article key={stock.id} className="rounded-lg border border-gray-200 p-3">
              <h3 className="break-words font-semibold text-gray-900">{getProdutoNome(stock.productId)}</h3>
              <p className="mt-1 break-words text-sm text-gray-600">
                <span className="font-medium">Local:</span> {getLocalizacaoCodigo(stock.locationId)}
              </p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <dt className="text-xs text-gray-500">Físico</dt>
                  <dd className="font-medium text-gray-900">{stock.physicalQuantity}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Reservado</dt>
                  <dd className="font-semibold text-orange-600">{stock.reservedQuantity}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Disponível</dt>
                  <dd className="font-bold text-green-600">{stock.availableQuantity}</dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-row gap-2">
                <button
                  onClick={() => {
                    onSelecionarParaMovimento(stock.productId, stock.locationId);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 whitespace-nowrap rounded-md bg-blue-50 px-2 py-2 text-center text-sm text-blue-700"
                >
                  Movimentar
                </button>
                <button
                  onClick={() => onSelecionarParaTransferencia(stock.productId, stock.locationId, stock.physicalQuantity)}
                  className="flex-1 whitespace-nowrap rounded-md bg-purple-50 px-2 py-2 text-center text-sm text-purple-700"
                >
                  Transferir
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
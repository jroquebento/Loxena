import { useState } from 'react';
import type { OrderStatus, OrderSummary } from '../types/Order';
import { SearchInput } from './SearchInput';
import { formatDataBrasileira } from '../utils/dateUtils';
import { normalizeSearchText } from '../utils/searchUtils';

interface OrderListProps {
  orders: OrderSummary[];
  isLoading: boolean;
  onViewDetails: (id: string) => void; 
}

export function OrderList({ orders, isLoading, onViewDetails }: OrderListProps) {
  const [valorBusca, definirValorBusca] = useState('');
  const buscaNormalizada = normalizeSearchText(valorBusca);
  const estilosStatus: Record<OrderStatus, { text: string; css: string }> = {
    Pending: { text: 'Pendente', css: 'bg-yellow-100 text-yellow-800' },
    Picking: { text: 'Em Separação', css: 'bg-blue-100 text-blue-800' },
    Checking: { text: 'Em Conferência', css: 'bg-indigo-100 text-indigo-800' },
    Packing: { text: 'Em Embalagem', css: 'bg-purple-100 text-purple-800' },
    Shipped: { text: 'Expedido', css: 'bg-teal-100 text-teal-800' },
    Delivered: { text: 'Entregue', css: 'bg-green-100 text-green-800' },
    Canceled: { text: 'Cancelado', css: 'bg-red-100 text-red-800' }
  };
  const renderStatusBadge = (status: OrderStatus) => {
    const badge = estilosStatus[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.css}`}>
        {badge.text}
      </span>
    );
  };
  const pedidosFiltrados = orders.filter((pedido) =>
    normalizeSearchText(pedido.customerName).includes(buscaNormalizada) ||
    normalizeSearchText(pedido.id).includes(buscaNormalizada) ||
    normalizeSearchText(`${pedido.status} ${estilosStatus[pedido.status].text}`).includes(buscaNormalizada)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <span className="text-gray-500 font-medium">Carregando pedidos...</span>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-700">Lista de Pedidos</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {pedidosFiltrados.length} pedidos
        </span>
      </div>

      <SearchInput
        valor={valorBusca}
        aoAlterar={definirValorBusca}
        placeholder="Buscar por cliente, pedido ou status..."
      />

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID do Pedido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pedidosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  {orders.length === 0 ? 'Nenhum pedido encontrado.' : 'Nenhum pedido corresponde à busca.'}
                </td>
              </tr>
            ) : (
              pedidosFiltrados.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 uppercase">
                    <span title={order.id}>{order.id.substring(0, 8)}...</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                    {order.itemCount} SKUs ({order.totalUnits} un.)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDataBrasileira(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button 
                      onClick={() => onViewDetails(order.id)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition"
                    >
                      Operar / Detalhes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {pedidosFiltrados.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            {orders.length === 0 ? 'Nenhum pedido encontrado.' : 'Nenhum pedido corresponde à busca.'}
          </p>
        ) : (
          pedidosFiltrados.map((order) => (
            <article key={order.id} className="rounded-lg border border-gray-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="min-w-0 break-all text-sm font-semibold text-gray-900">Pedido {order.id}</h3>
                {renderStatusBadge(order.status)}
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-700">Cliente</dt>
                  <dd className="break-words text-gray-600">{order.customerName}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="font-medium text-gray-700">Itens</dt>
                  <dd className="text-right text-gray-600">{order.itemCount} SKUs ({order.totalUnits} un.)</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="font-medium text-gray-700">Data</dt>
                  <dd className="text-right text-gray-600">{formatDataBrasileira(order.createdAt)}</dd>
                </div>
                <div className="flex justify-between gap-2 border-t border-gray-100 pt-2">
                  <dt className="font-medium text-gray-700">Total</dt>
                  <dd className="text-right font-semibold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalAmount)}
                  </dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-row gap-2">
                <button
                  onClick={() => onViewDetails(order.id)}
                  className="w-full whitespace-nowrap rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                >
                  Operar / Detalhes
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
import type { OrderStatus, OrderSummary } from '../types/Order';

interface OrderListProps {
  orders: OrderSummary[];
  isLoading: boolean;
  onViewDetails: (id: string) => void; 
}

export function OrderList({ orders, isLoading, onViewDetails }: OrderListProps) {
  
  const renderStatusBadge = (status: OrderStatus) => {
    const badges: Record<OrderStatus, { text: string; css: string }> = {
      Pending: { text: 'Pendente', css: 'bg-yellow-100 text-yellow-800' },
      Picking: { text: 'Em Separação', css: 'bg-blue-100 text-blue-800' },
      Checking: { text: 'Em Conferência', css: 'bg-indigo-100 text-indigo-800' },
      Packing: { text: 'Em Embalagem', css: 'bg-purple-100 text-purple-800' },
      Shipped: { text: 'Expedido', css: 'bg-teal-100 text-teal-800' },
      Delivered: { text: 'Entregue', css: 'bg-green-100 text-green-800' },
      Canceled: { text: 'Cancelado', css: 'bg-red-100 text-red-800' }
    };

    const badge = badges[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.css}`}>
        {badge.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <span className="text-gray-500 font-medium">Carregando pedidos...</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Lista de Pedidos</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {orders.length} pedidos
        </span>
      </div>

      <div className="overflow-x-auto">
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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 uppercase">
                    {order.id.substring(0, 8)}... 
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-700" title={order.customerName}>
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                    {order.itemCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
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
    </div>
  );
}
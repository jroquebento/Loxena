import type { OrderStatus } from '../types/Order';
import type { Order } from '../types/Order';

interface OrderSummaryProps {
  pedido: Order;
}

const estilosStatus: Record<OrderStatus, { texto: string; classeCss: string }> = {
  Pending: { texto: 'Pendente', classeCss: 'bg-yellow-100 text-yellow-800' },
  Picking: { texto: 'Em Separação', classeCss: 'bg-blue-100 text-blue-800' },
  Checking: { texto: 'Em Conferência', classeCss: 'bg-indigo-100 text-indigo-800' },
  Packing: { texto: 'Em Embalagem', classeCss: 'bg-purple-100 text-purple-800' },
  Shipped: { texto: 'Expedido', classeCss: 'bg-teal-100 text-teal-800' },
  Delivered: { texto: 'Entregue', classeCss: 'bg-green-100 text-green-800' },
  Canceled: { texto: 'Cancelado', classeCss: 'bg-red-100 text-red-800' }
};

export function OrderSummary({ pedido }: OrderSummaryProps) {
  const seloStatus = estilosStatus[pedido.status] || {
    texto: pedido.status,
    classeCss: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Pedido {pedido.id.substring(0, 8)}...</h2>
        <p className="text-gray-500 text-sm mt-1">Data: {new Date(pedido.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })}</p>
      </div>
      <div className="text-right">
        <div className="mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${seloStatus.classeCss}`}>
            {seloStatus.texto}
          </span>
        </div>
        <p className="text-xl font-bold text-green-700 mt-1">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.totalAmount)}
        </p>
      </div>
    </div>
  );
}

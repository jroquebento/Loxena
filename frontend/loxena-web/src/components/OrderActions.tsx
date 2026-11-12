import type { Order } from '../types/Order';

interface OrderActionsProps {
  pedido: Order;
  processandoAcao: boolean;
  iniciarPicking: () => void;
  iniciarConferencia: () => void;
  iniciarEmbalagem: () => void;
  expedirPedido: () => void;
  registrarEntrega: () => void;
  cancelarPedido: () => void;
}

export function OrderActions({
  pedido,
  processandoAcao,
  iniciarPicking,
  iniciarConferencia,
  iniciarEmbalagem,
  expedirPedido,
  registrarEntrega,
  cancelarPedido
}: OrderActionsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Ações Operacionais</h3>

      <div className="flex flex-wrap gap-3">
        {pedido.status === 'Pending' && (
          <button
            disabled={processandoAcao}
            onClick={iniciarPicking}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
          >
            Iniciar Separação (Picking)
          </button>
        )}

        {pedido.status === 'Picking' && (
          <button
            disabled={processandoAcao}
            onClick={iniciarConferencia}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
          >
            Iniciar Conferência (Checking)
          </button>
        )}

        {pedido.status === 'Checking' && (
          <button
            disabled={processandoAcao}
            onClick={iniciarEmbalagem}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
          >
            Iniciar Embalagem (Packing)
          </button>
        )}

        {pedido.status === 'Packing' && (
          <button
            disabled={processandoAcao}
            onClick={expedirPedido}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
          >
            Expedir Pedido (Ship)
          </button>
        )}

        {pedido.status === 'Shipped' && (
          <button
            disabled={processandoAcao}
            onClick={registrarEntrega}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
          >
            Registrar Entrega (Deliver)
          </button>
        )}

        {pedido.status !== 'Shipped' && pedido.status !== 'Delivered' && pedido.status !== 'Canceled' && (
          <button
            disabled={processandoAcao}
            onClick={cancelarPedido}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm ml-auto disabled:opacity-50"
          >
            Cancelar Pedido
          </button>
        )}
      </div>
    </div>
  );
}

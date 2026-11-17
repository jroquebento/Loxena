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
    <div className="mb-6 rounded-lg bg-white p-4 shadow-md sm:p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Ações Operacionais</h3>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {pedido.status === 'Pending' && (
          <button
            disabled={processandoAcao}
            onClick={iniciarPicking}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
          >
            Iniciar Separação (Picking)
          </button>
        )}

        {pedido.status === 'Picking' && (
          <button
            disabled={processandoAcao}
            onClick={iniciarConferencia}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 sm:w-auto"
          >
            Iniciar Conferência (Checking)
          </button>
        )}

        {pedido.status === 'Checking' && (
          <button
            disabled={processandoAcao}
            onClick={iniciarEmbalagem}
            className="w-full rounded-md bg-purple-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-purple-700 disabled:opacity-50 sm:w-auto"
          >
            Iniciar Embalagem (Packing)
          </button>
        )}

        {pedido.status === 'Packing' && (
          <button
            disabled={processandoAcao}
            onClick={expedirPedido}
            className="w-full rounded-md bg-teal-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50 sm:w-auto"
          >
            Expedir Pedido (Ship)
          </button>
        )}

        {pedido.status === 'Shipped' && (
          <button
            disabled={processandoAcao}
            onClick={registrarEntrega}
            className="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50 sm:w-auto"
          >
            Registrar Entrega (Deliver)
          </button>
        )}

        {pedido.status !== 'Shipped' && pedido.status !== 'Delivered' && pedido.status !== 'Canceled' && (
          <button
            disabled={processandoAcao}
            onClick={cancelarPedido}
            className="ml-0 w-full rounded-md bg-red-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50 sm:ml-auto sm:w-auto"
          >
            Cancelar Pedido
          </button>
        )}
      </div>
    </div>
  );
}

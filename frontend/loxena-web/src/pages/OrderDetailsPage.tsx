import { OrderActions } from '../components/OrderActions';
import { OrderItemList } from '../components/OrderItemList';
import { OrderSummary } from '../components/OrderSummary';
import { useOrderDetails } from '../hooks/useOrderDetails';

export function OrderDetailsPage() {
  const {
    pedido,
    carregando,
    processandoAcao,
    quantidadesSeparacao,
    alterarQuantidadeSeparacao,
    iniciarPicking,
    iniciarConferencia,
    iniciarEmbalagem,
    expedirPedido,
    registrarEntrega,
    cancelarPedido,
    separarItem,
    voltarParaPedidos
  } = useOrderDetails();

  if (carregando) {
    return <div className="p-8 text-center text-gray-500">Carregando detalhes...</div>;
  }

  if (!pedido) {
    return <div className="p-8 text-center text-red-500">Pedido não encontrado.</div>;
  }

  const existemAcoesVisiveis =
    pedido.status === 'Pending' ||
    pedido.status === 'Picking' ||
    pedido.status === 'Checking' ||
    pedido.status === 'Packing' ||
    pedido.status === 'Shipped';

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={voltarParaPedidos}
          className="text-blue-600 hover:underline mb-4 flex items-center font-medium"
        >
          ← Voltar para lista
        </button>

        <OrderSummary pedido={pedido} />

        {existemAcoesVisiveis && (
        <OrderActions
          pedido={pedido}
            processandoAcao={processandoAcao}
            iniciarPicking={iniciarPicking}
            iniciarConferencia={iniciarConferencia}
            iniciarEmbalagem={iniciarEmbalagem}
            expedirPedido={expedirPedido}
            registrarEntrega={registrarEntrega}
            cancelarPedido={cancelarPedido}
          />
        )}

        <OrderItemList
          pedido={pedido}
          processandoAcao={processandoAcao}
          quantidadesSeparacao={quantidadesSeparacao}
          alterarQuantidadeSeparacao={alterarQuantidadeSeparacao}
          separarItem={separarItem}
        />
      </div>
    </div>
  );
}
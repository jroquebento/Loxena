import type { Order } from '../types/Order';

interface OrderItemListProps {
  pedido: Order;
  processandoAcao: boolean;
  quantidadesSeparacao: Record<string, number>;
  alterarQuantidadeSeparacao: (itemPedidoId: string, quantidade: number) => void;
  separarItem: (itemPedidoId: string) => void;
}

export function OrderItemList({
  pedido,
  processandoAcao,
  quantidadesSeparacao,
  alterarQuantidadeSeparacao,
  separarItem
}: OrderItemListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Itens do Pedido & Separação</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Solicitado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Separado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
              {pedido.status === 'Picking' && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ação Picking</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pedido.items.map(itemPedido => (
              <tr key={itemPedido.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 uppercase">
                  {itemPedido.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                  {itemPedido.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-600">
                  {itemPedido.pickedQuantity} / {itemPedido.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemPedido.unitPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemPedido.quantity * itemPedido.unitPrice)}
                </td>

                {pedido.status === 'Picking' && (
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {itemPedido.pickedQuantity < itemPedido.quantity ? (
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max={itemPedido.quantity - itemPedido.pickedQuantity}
                          value={quantidadesSeparacao[itemPedido.id] || ''}
                          onChange={(evento) => alterarQuantidadeSeparacao(itemPedido.id, Number(evento.target.value))}
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Qtd"
                        />
                        <button
                          disabled={processandoAcao}
                          onClick={() => separarItem(itemPedido.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded transition disabled:opacity-50"
                        >
                          Separar
                        </button>
                      </div>
                    ) : (
                      <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
                        Separado 100% ✓
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

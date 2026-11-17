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
    <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Itens do Pedido & Separação</h3>
      <div className="hidden overflow-x-auto md:block">
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
                      <div className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
                        <input
                          type="number"
                          min="1"
                          max={itemPedido.quantity - itemPedido.pickedQuantity}
                          value={quantidadesSeparacao[itemPedido.id] || ''}
                          onChange={(evento) => alterarQuantidadeSeparacao(itemPedido.id, Number(evento.target.value))}
                          className="w-full rounded border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-20"
                          placeholder="Qtd"
                        />
                        <button
                          disabled={processandoAcao}
                          onClick={() => separarItem(itemPedido.id)}
                          className="w-full rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
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

      <div className="space-y-3 md:hidden">
        {pedido.items.map(itemPedido => (
          <article key={itemPedido.id} className="rounded-lg border border-gray-200 p-3">
            <h4 className="break-words font-semibold text-gray-900">{itemPedido.productName}</h4>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-gray-600">Solicitado</dt>
                <dd className="text-right text-gray-900">{itemPedido.quantity}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-600">Separado</dt>
                <dd className="text-right font-semibold text-blue-600">{itemPedido.pickedQuantity} / {itemPedido.quantity}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-600">Preço unitário</dt>
                <dd className="text-right text-gray-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemPedido.unitPrice)}
                </dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-gray-100 pt-1">
                <dt className="font-medium text-gray-700">Subtotal</dt>
                <dd className="text-right font-semibold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemPedido.quantity * itemPedido.unitPrice)}
                </dd>
              </div>
            </dl>
            {pedido.status === 'Picking' && itemPedido.pickedQuantity < itemPedido.quantity && (
              <div className="mt-3 flex flex-row items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={itemPedido.quantity - itemPedido.pickedQuantity}
                  value={quantidadesSeparacao[itemPedido.id] || ''}
                  onChange={(evento) => alterarQuantidadeSeparacao(itemPedido.id, Number(evento.target.value))}
                  className="w-20 shrink-0 rounded border border-gray-300 px-2 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Qtd"
                />
                <button
                  disabled={processandoAcao}
                  onClick={() => separarItem(itemPedido.id)}
                  className="flex-1 whitespace-nowrap rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Separar
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

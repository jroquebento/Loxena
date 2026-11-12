import type { ReactNode, SyntheticEvent } from 'react';
import type { Customer as Cliente } from '../types/Customer';
import type { ItemCarrinho } from '../hooks/useCreateOrder';

interface OrderFormProps {
  clientes: Cliente[];
  clienteSelecionadoId: string;
  definirClienteSelecionadoId: (clienteId: string) => void;
  itensCarrinho: ItemCarrinho[];
  valorTotal: number;
  removerDoCarrinho: (produtoId: string) => void;
  enviandoPedido: boolean;
  finalizarPedido: (evento: SyntheticEvent<HTMLFormElement>) => void | Promise<void>;
  aoCancelar: () => void;
  children: ReactNode;
}

export function OrderForm({
  clientes,
  clienteSelecionadoId,
  definirClienteSelecionadoId,
  itensCarrinho,
  valorTotal,
  removerDoCarrinho,
  enviandoPedido,
  finalizarPedido,
  aoCancelar,
  children
}: OrderFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Pedido (Carrinho WMS)</h2>

      <form onSubmit={finalizarPedido} noValidate>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
          <select
            value={clienteSelecionadoId}
            onChange={(evento) => definirClienteSelecionadoId(evento.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Selecione um cliente...</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>{cliente.name}</option>
            ))}
          </select>
        </div>

        {children}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Itens no Carrinho</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qtd</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {itensCarrinho.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-gray-500 text-sm">
                      Nenhum item adicionado ao carrinho ainda.
                    </td>
                  </tr>
                ) : (
                  itensCarrinho.map(item => (
                    <tr key={item.produtoId}>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.nomeProduto}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700">{item.quantidade}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-500">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.precoUnitario)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantidade * item.precoUnitario)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removerDoCarrinho(item.produtoId)}
                          className="text-red-600 hover:text-red-900 text-xs font-medium bg-red-50 px-2 py-1 rounded"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <div className="text-right">
              <span className="text-gray-600 text-sm mr-4">Total do Pedido:</span>
              <span className="text-2xl font-bold text-green-700">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <button
            type="button"
            onClick={aoCancelar}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-5 py-2 rounded-md transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviandoPedido || itensCarrinho.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition shadow-md disabled:opacity-50"
          >
            {enviandoPedido ? 'Salvando...' : 'Finalizar Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
}

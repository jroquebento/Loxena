import { OrderForm } from '../components/OrderForm';
import { OrderItemForm } from '../components/OrderItemForm';
import { useCreateOrder } from '../hooks/useCreateOrder';

export function CreateOrderPage() {
  const {
    clientes,
    produtosComEstoque,
    carregandoDados,
    enviandoPedido,
    clienteSelecionadoId,
    definirClienteSelecionadoId,
    itensCarrinho,
    produtoAtualId,
    definirProdutoAtualId,
    quantidadeAtual,
    definirQuantidadeAtual,
    estoqueProdutoSelecionado,
    obterEstoqueRestante,
    valorTotal,
    adicionarAoCarrinho,
    removerDoCarrinho,
    finalizarPedido,
    navegar
  } = useCreateOrder();

  if (carregandoDados) {
    return <div className="p-4 text-center text-gray-500 sm:p-6 lg:p-8">Carregando formulário e saldos de estoque...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navegar('/pedidos')}
          className="text-blue-600 hover:underline mb-4 flex items-center font-medium"
        >
          ← Voltar para lista
        </button>

        <OrderForm
          clientes={clientes}
          clienteSelecionadoId={clienteSelecionadoId}
          definirClienteSelecionadoId={definirClienteSelecionadoId}
          itensCarrinho={itensCarrinho}
          valorTotal={valorTotal}
          removerDoCarrinho={removerDoCarrinho}
          enviandoPedido={enviandoPedido}
          finalizarPedido={finalizarPedido}
          aoCancelar={() => navegar('/pedidos')}
        >
          <OrderItemForm
            produtosComEstoque={produtosComEstoque}
            produtoAtualId={produtoAtualId}
            definirProdutoAtualId={definirProdutoAtualId}
            quantidadeAtual={quantidadeAtual}
            definirQuantidadeAtual={definirQuantidadeAtual}
            estoqueProdutoSelecionado={estoqueProdutoSelecionado}
            obterEstoqueRestante={obterEstoqueRestante}
            adicionarAoCarrinho={adicionarAoCarrinho}
          />
        </OrderForm>
      </div>
    </div>
  );
}
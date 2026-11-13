import type { Product as Produto } from '../types/Product';

interface OrderItemFormProps {
  produtosComEstoque: Produto[];
  produtoAtualId: string;
  definirProdutoAtualId: (produtoId: string) => void;
  quantidadeAtual: number;
  definirQuantidadeAtual: (quantidade: number) => void;
  estoqueProdutoSelecionado: number;
  obterEstoqueRestante: (produtoId: string) => number;
  adicionarAoCarrinho: () => void;
}

export function OrderItemForm({
  produtosComEstoque,
  produtoAtualId,
  definirProdutoAtualId,
  quantidadeAtual,
  definirQuantidadeAtual,
  estoqueProdutoSelecionado,
  obterEstoqueRestante,
  adicionarAoCarrinho
}: OrderItemFormProps) {
  return (
    <div className="border-t pt-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Adicionar Produtos</h3>
      <p className="text-xs text-gray-500 mb-4">Apenas produtos com saldo físico disponível em estoque são exibidos.</p>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Produto (Disponível) <span className="text-red-500">*</span></label>
          <select
            value={produtoAtualId}
            onChange={(evento) => definirProdutoAtualId(evento.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione um produto com estoque...</option>
            {produtosComEstoque.map(produto => {
              const estoqueRestante = obterEstoqueRestante(produto.id);
              return (
                <option key={produto.id} value={produto.id}>
                  {produto.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.price)} (Disponível: {estoqueRestante})
                </option>
              );
            })}
          </select>
        </div>

        <div className="w-36">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade <span className="text-red-500">*</span> {produtoAtualId && <span className="text-xs text-green-600 font-bold">(Máx: {estoqueProdutoSelecionado})</span>}
          </label>
          <input
            type="number"
            min="1"
            max={estoqueProdutoSelecionado || 1}
            value={quantidadeAtual}
            onChange={(evento) => definirQuantidadeAtual(Number(evento.target.value))}
            className="w-full border border-gray-300 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={adicionarAoCarrinho}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition h-10"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}

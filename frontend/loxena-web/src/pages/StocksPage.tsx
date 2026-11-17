import { StockForm } from '../components/StockForm';
import { StockList } from '../components/StockList';
import { useStockMovements } from '../hooks/useStockMovements';

export function StocksPage() {
  const {
    stocks,
    produtos,
    localizacoes,
    preSelecao,
    selecionarParaMovimento,
    limparSelecao,
    movimentar,
    transferir
  } = useStockMovements();

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <h1 id="topo-pagina" className="mb-8 text-2xl font-bold text-blue-800 text-center sm:text-3xl lg:text-4xl">
        Controle de Estoque
      </h1>
      
      <StockForm 
        key={preSelecao ? `${preSelecao.productId}-${preSelecao.locationId}` : 'novo'}
        produtos={produtos}
        localizacoes={localizacoes}
        onMovimentar={movimentar}
        preSelecao={preSelecao}
        onLimparSelecao={limparSelecao}
        />
      
      <StockList 
        stocks={stocks} 
        produtos={produtos}
        localizacoes={localizacoes}
        onSelecionarParaMovimento={selecionarParaMovimento}
        onSelecionarParaTransferencia={transferir}
      />
    </div>
  );
}
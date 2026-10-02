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
    <div className="p-8 max-w-6xl mx-auto"> 
      <h1 id="topo-pagina" className="text-4xl font-bold text-blue-800 text-center mb-8">
        Painel de Estoque
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
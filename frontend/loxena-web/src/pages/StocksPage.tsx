import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import type { Stock } from '../types/Stock';
import type { Product } from '../types/Product';
import type { Location } from '../types/Location';

import { stockService } from '../services/stockService';
import { productService } from '../services/productService';
import { locationService } from '../services/locationService';

import { StockForm } from '../components/StockForm';
import { StockList } from '../components/StockList';

export function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [localizacoes, setLocalizacoes] = useState<Location[]>([]);
  
  const [preSelecao, setPreSelecao] = useState<{ productId: string, locationId: string } | null>(null);

  const carregarEstoque = useCallback(async () => {
    try {
      const data = await stockService.getAll();
      setStocks(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const carregarTudo = async () => {
      try {
        const [prods, locs] = await Promise.all([
          productService.getAll(),
          locationService.getAll()
        ]);
        setProdutos(prods);
        setLocalizacoes(locs);
        await carregarEstoque();
      } catch (error) {
            console.error("Falha ao buscar dependências:", error); 
            toast.error("Erro ao carregar os dados iniciais.");
      }
    };
    carregarTudo();
  }, [carregarEstoque]);

    const handleMovimentacao = async (tipo: 'entrada' | 'saida', productId: string, locationId: string, amount: number) => {
    const payload = { productId, locationId, amount };
    
    try {
      if (tipo === 'entrada') {
        await stockService.addQuantity(payload);
        toast.success(`Entrada de ${amount} unidades realizada com sucesso!`);
      } else {
        await stockService.removeQuantity(payload);
        toast.success(`Baixa de ${amount} unidades realizada com sucesso!`);
      }
      
      setPreSelecao(null);
      await carregarEstoque(); 
      
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error(`Erro ao realizar ${tipo} no estoque.`);
        }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto"> 
      <h1 id="topo-pagina" className="text-4xl font-bold text-blue-800 text-center mb-8">
        Painel de Estoque
      </h1>
      
      <StockForm 
        key={preSelecao ? `${preSelecao.productId}-${preSelecao.locationId}` : 'novo'}
        produtos={produtos}
        localizacoes={localizacoes}
        onMovimentar={handleMovimentacao}
        preSelecao={preSelecao}
        onLimparSelecao={() => setPreSelecao(null)}
      />
      
      <StockList 
        stocks={stocks} 
        produtos={produtos}
        localizacoes={localizacoes}
        onSelecionarParaMovimento={(prodId, locId) => setPreSelecao({ productId: prodId, locationId: locId })}
      />
    </div>
  );
}
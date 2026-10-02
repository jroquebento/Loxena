import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import type { Stock } from '../types/Stock';
import type { Product } from '../types/Product';
import type { Location } from '../types/Location';

import { stockService } from '../services/stockService';
import { productService } from '../services/productService';
import { locationService } from '../services/locationService';
import { solicitarDadosTransferencia } from '../utils/alertUtils';

export function useStockMovements() {
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

  const movimentar = async (tipo: 'entrada' | 'saida', productId: string, locationId: string, amount: number) => {
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
      toast.error(error instanceof Error ? error.message : `Erro ao realizar ${tipo}.`);
    }
  };

  const transferir = async (productId: string, sourceLocationId: string, maxAmount: number) => {
    const produtoNome = produtos.find(p => p.id === productId)?.name || 'Desconhecido';
    const localOrigemCodigo = localizacoes.find(l => l.id === sourceLocationId)?.code || 'Desconhecido';
    const locaisDestino = localizacoes.filter(l => l.id !== sourceLocationId);

    const dados = await solicitarDadosTransferencia(produtoNome, localOrigemCodigo, maxAmount, locaisDestino);

    if (dados) {
      try {
        await stockService.transfer({
          productId,
          sourceLocationId,
          targetLocationId: dados.targetLocationId,
          amount: dados.amount
        });
        toast.success(`Transferência de ${dados.amount} unidades realizada!`);
        await carregarEstoque();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao realizar transferência.");
      }
    }
  };

  return {
    stocks,
    produtos,
    localizacoes,
    preSelecao,
    selecionarParaMovimento: (productId: string, locationId: string) => setPreSelecao({ productId, locationId }),
    limparSelecao: () => setPreSelecao(null),
    movimentar,
    transferir
  };
}
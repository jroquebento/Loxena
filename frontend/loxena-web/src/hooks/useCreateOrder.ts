import { useEffect, useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import { tratarErro } from '../utils/apiUtils';
import type { Customer as Cliente } from '../types/Customer';
import type { Product as Produto } from '../types/Product';
import type { Stock as Estoque } from '../types/Stock';

export interface ItemCarrinho {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  estoqueMaximo: number;
}

export function useCreateOrder() {
  const navegar = useNavigate();

  const [clientes, definirClientes] = useState<Cliente[]>([]);
  const [produtos, definirProdutos] = useState<Produto[]>([]);
  const [estoques, definirEstoques] = useState<Estoque[]>([]);
  const [carregandoDados, definirCarregandoDados] = useState(true);
  const [enviandoPedido, definirEnviandoPedido] = useState(false);
  const [clienteSelecionadoId, definirClienteSelecionadoId] = useState('');
  const [itensCarrinho, definirItensCarrinho] = useState<ItemCarrinho[]>([]);
  const [produtoAtualId, definirProdutoAtualId] = useState('');
  const [quantidadeAtual, definirQuantidadeAtual] = useState(1);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [respostaClientes, respostaProdutos, respostaEstoques] = await Promise.all([
          fetch('https://localhost:7175/Customers'),
          fetch('https://localhost:7175/Products'),
          fetch('https://localhost:7175/Stocks')
        ]);

        await tratarErro(respostaClientes, 'Falha ao buscar clientes');
        await tratarErro(respostaProdutos, 'Falha ao buscar produtos');
        await tratarErro(respostaEstoques, 'Falha ao buscar estoque');

        definirClientes(await respostaClientes.json());
        definirProdutos(await respostaProdutos.json());
        definirEstoques(await respostaEstoques.json());
      } catch (erro: unknown) {
        console.error(erro);
        const mensagem = erro instanceof Error ? erro.message : 'Erro ao carregar dados.';
        toast.error(mensagem);
      } finally {
        definirCarregandoDados(false);
      }
    }

    carregarDados();
  }, []);

  const obterEstoqueDisponivelProduto = (produtoId: string) => {
    return estoques
      .filter(estoque => estoque.productId === produtoId)
      .reduce((total, estoque) => total + estoque.availableQuantity, 0);
  };

  const obterEstoqueRestante = (produtoId: string) => {
    const estoqueTotal = obterEstoqueDisponivelProduto(produtoId);
    const itemNoCarrinho = itensCarrinho.find(item => item.produtoId === produtoId);
    const quantidadeNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;

    return estoqueTotal - quantidadeNoCarrinho;
  };

  const produtosComEstoque = produtos.filter(produto => obterEstoqueRestante(produto.id) > 0);
  const estoqueProdutoSelecionado = produtoAtualId ? obterEstoqueRestante(produtoAtualId) : 0;

  const adicionarAoCarrinho = () => {
    if (!produtoAtualId) {
      toast.warn('Selecione um produto.');
      return;
    }
    if (!Number.isInteger(quantidadeAtual) || quantidadeAtual <= 0) {
      toast.warn('Informe uma quantidade inteira maior que zero.');
      return;
    }

    const produtoEncontrado = produtos.find(produto => produto.id === produtoAtualId);
    if (!produtoEncontrado) return;

    const estoqueDisponivel = obterEstoqueDisponivelProduto(produtoAtualId);
    const itemExistente = itensCarrinho.find(item => item.produtoId === produtoAtualId);
    const quantidadeTotalSolicitada = (itemExistente?.quantidade || 0) + Number(quantidadeAtual);

    if (quantidadeTotalSolicitada > estoqueDisponivel) {
      toast.error(`Estoque insuficiente! Disponível: ${estoqueDisponivel}, Solicitado no total: ${quantidadeTotalSolicitada}.`);
      return;
    }

    if (itemExistente) {
      definirItensCarrinho(itensCarrinho.map(item =>
        item.produtoId === produtoAtualId
          ? { ...item, quantidade: quantidadeTotalSolicitada }
          : item
      ));
    } else {
      definirItensCarrinho([
        ...itensCarrinho,
        {
          produtoId: produtoEncontrado.id,
          nomeProduto: produtoEncontrado.name,
          quantidade: Number(quantidadeAtual),
          precoUnitario: produtoEncontrado.price,
          estoqueMaximo: estoqueDisponivel
        }
      ]);
    }

    definirProdutoAtualId('');
    definirQuantidadeAtual(1);
  };

  const removerDoCarrinho = (produtoId: string) => {
    definirItensCarrinho(itensCarrinho.filter(item => item.produtoId !== produtoId));
  };

  const valorTotal = itensCarrinho.reduce((total, item) => total + item.quantidade * item.precoUnitario, 0);

  const finalizarPedido = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!clienteSelecionadoId) {
      toast.warn('Selecione um cliente para o pedido.');
      return;
    }
    if (itensCarrinho.length === 0) {
      toast.warn('Adicione pelo menos um item ao carrinho.');
      return;
    }

    definirEnviandoPedido(true);
    try {
      await orderService.create({
        customerId: clienteSelecionadoId,
        items: itensCarrinho.map(item => ({
          productId: item.produtoId,
          quantity: item.quantidade
        }))
      });

      toast.success('Pedido criado com sucesso!');
      navegar('/pedidos');
    } catch (erro: unknown) {
      console.error(erro);
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao criar pedido.';
      toast.error(mensagem);
    } finally {
      definirEnviandoPedido(false);
    }
  };

  return {
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
  };
}

import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import type { Order } from '../types/Order';
import { confirmarExclusao } from '../utils/alertUtils';

export function useOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navegar = useNavigate();

  const [pedido, definirPedido] = useState<Order | null>(null);
  const [carregando, definirCarregando] = useState(true);
  const [processandoAcao, definirProcessandoAcao] = useState(false);
  const [quantidadesSeparacao, definirQuantidadesSeparacao] = useState<Record<string, number>>({});

  const carregarPedido = useCallback(async (podeAtualizar: () => boolean = () => true) => {
    if (!id) return;

    try {
      const pedidoCarregado = await orderService.getById(id);
      if (podeAtualizar()) {
        definirPedido(pedidoCarregado);
      }
    } catch (erro: unknown) {
      if (!podeAtualizar()) return;

      console.error(erro);
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao carregar detalhes do pedido.';
      toast.error(mensagem);
      navegar('/pedidos');
    }
  }, [id, navegar]);

  useEffect(() => {
    let componenteMontado = true;

    async function carregarPedidoInicial() {
      await carregarPedido(() => componenteMontado);
      if (componenteMontado) {
        definirCarregando(false);
      }
    }

    carregarPedidoInicial();

    return () => {
      componenteMontado = false;
    };
  }, [carregarPedido]);

  const executarAcaoStatus = async (operacao: () => Promise<void>, mensagemSucesso: string) => {
    definirProcessandoAcao(true);
    try {
      await operacao();
      toast.success(mensagemSucesso);
      await carregarPedido();
    } catch (erro: unknown) {
      console.error(erro);
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao executar operação no pedido.';
      toast.error(mensagem);
    } finally {
      definirProcessandoAcao(false);
    }
  };

  const iniciarPicking = async () => {
    if (!pedido) return;
    await executarAcaoStatus(() => orderService.startPicking(pedido.id), 'Separação iniciada!');
  };

  const iniciarConferencia = async () => {
    if (!pedido) return;
    await executarAcaoStatus(() => orderService.startChecking(pedido.id), 'Iniciada conferência do pedido!');
  };

  const iniciarEmbalagem = async () => {
    if (!pedido) return;
    await executarAcaoStatus(() => orderService.startPacking(pedido.id), 'Pedido em embalagem!');
  };

  const expedirPedido = async () => {
    if (!pedido) return;
    await executarAcaoStatus(() => orderService.ship(pedido.id), 'Pedido expedido com sucesso!');
  };

  const registrarEntrega = async () => {
    if (!pedido) return;
    await executarAcaoStatus(() => orderService.deliver(pedido.id), 'Pedido entregue!');
  };

  const cancelarPedido = async () => {
    if (!pedido) return;

    const confirmado = await confirmarExclusao('este pedido (o estoque reservado será liberado)');
    if (confirmado) {
      await executarAcaoStatus(() => orderService.cancel(pedido.id), 'Pedido cancelado com sucesso.');
    }
  };

  const alterarQuantidadeSeparacao = (itemPedidoId: string, quantidade: number) => {
    definirQuantidadesSeparacao({
      ...quantidadesSeparacao,
      [itemPedidoId]: quantidade
    });
  };

  const separarItem = async (itemPedidoId: string) => {
    if (!pedido) return;

    const quantidadeParaSeparar = quantidadesSeparacao[itemPedidoId];
    const itemPedido = pedido.items.find(item => item.id === itemPedidoId);
    if (!Number.isInteger(quantidadeParaSeparar) || quantidadeParaSeparar <= 0) {
      toast.warn('Informe uma quantidade inteira maior que zero para separar.');
      return;
    }
    if (!itemPedido || quantidadeParaSeparar > itemPedido.quantity - itemPedido.pickedQuantity) {
      toast.warn('A quantidade informada excede o que falta separar.');
      return;
    }

    definirProcessandoAcao(true);
    try {
      await orderService.pickItem(pedido.id, {
        orderItemId: itemPedidoId,
        quantity: Number(quantidadeParaSeparar)
      });
      definirQuantidadesSeparacao(quantidadesAtuais => {
        const quantidadesAtualizadas = { ...quantidadesAtuais };
        delete quantidadesAtualizadas[itemPedidoId];
        return quantidadesAtualizadas;
      });
      toast.success('Quantidade separada registrada com sucesso!');
      await carregarPedido();
    } catch (erro: unknown) {
      console.error(erro);
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao registrar separação do item.';
      toast.error(mensagem);
    } finally {
      definirProcessandoAcao(false);
    }
  };

  const voltarParaPedidos = () => navegar('/pedidos');

  return {
    pedido,
    carregando,
    processandoAcao,
    quantidadesSeparacao,
    alterarQuantidadeSeparacao,
    iniciarPicking,
    iniciarConferencia,
    iniciarEmbalagem,
    expedirPedido,
    registrarEntrega,
    cancelarPedido,
    separarItem,
    voltarParaPedidos
  };
}

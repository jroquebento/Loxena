import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { Order, OrderStatus } from '../types/Order';
import { orderService } from '../services/orderService';
import { confirmarExclusao } from '../utils/alertUtils.ts'; 

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pickingQuantities, setPickingQuantities] = useState<Record<string, number>>({});

  const renderStatusBadge = (status: OrderStatus) => {
    const badges: Record<OrderStatus, { text: string; css: string }> = {
      Pending: { text: 'Pendente', css: 'bg-yellow-100 text-yellow-800' },
      Picking: { text: 'Em Separação', css: 'bg-blue-100 text-blue-800' },
      Checking: { text: 'Em Conferência', css: 'bg-indigo-100 text-indigo-800' },
      Packing: { text: 'Em Embalagem', css: 'bg-purple-100 text-purple-800' },
      Shipped: { text: 'Expedido', css: 'bg-teal-100 text-teal-800' },
      Delivered: { text: 'Entregue', css: 'bg-green-100 text-green-800' },
      Canceled: { text: 'Cancelado', css: 'bg-red-100 text-red-800' }
    };

    const badge = badges[status] || { text: status, css: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.css}`}>
        {badge.text}
      </span>
    );
  };

  const carregarPedido = async () => {
    if (!id) return;
    try {
      const data = await orderService.getById(id);
      setOrder(data);
    } catch (error: unknown) {
      console.error(error);
      const mensagem = error instanceof Error ? error.message : "Erro ao carregar detalhes do pedido.";
      toast.error(mensagem);
      navigate('/pedidos');
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchInitialOrder() {
      if (!id) return;
      try {
        const data = await orderService.getById(id);
        if (isMounted) {
          setOrder(data);
        }
      } catch (error: unknown) {
        if (isMounted) {
          console.error(error);
          const mensagem = error instanceof Error ? error.message : "Erro ao carregar detalhes do pedido.";
          toast.error(mensagem);
          navigate('/pedidos');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchInitialOrder();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleAcaoStatus = async (acao: () => Promise<void>, mensagemSucesso: string) => {
    setIsSubmitting(true);
    try {
      await acao();
      toast.success(mensagemSucesso);
      await carregarPedido();
    } catch (error: unknown) {
      console.error(error);
      const mensagem = error instanceof Error ? error.message : "Erro ao executar operação no pedido.";
      toast.error(mensagem);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePickItem = async (orderItemId: string) => {
    if (!order) return;

    const qtdParaSeparar = pickingQuantities[orderItemId];
    const quantidadeRestante = order.items.find(item => item.id === orderItemId);
    if (!Number.isInteger(qtdParaSeparar) || qtdParaSeparar <= 0) {
      toast.warn("Informe uma quantidade inteira maior que zero para separar.");
      return;
    }
    if (!quantidadeRestante || qtdParaSeparar > quantidadeRestante.quantity - quantidadeRestante.pickedQuantity) {
      toast.warn("A quantidade informada excede o que falta separar.");
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.pickItem(order.id, {
        orderItemId,
        quantity: Number(qtdParaSeparar)
      });
      toast.success("Quantidade separada registrada com sucesso!");
      await carregarPedido();
    } catch (error: unknown) {
      console.error(error);
      const mensagem = error instanceof Error ? error.message : "Erro ao registrar separação do item.";
      toast.error(mensagem);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Carregando detalhes...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-red-500">Pedido não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        
        <button 
          onClick={() => navigate('/pedidos')}
          className="text-blue-600 hover:underline mb-4 flex items-center font-medium"
        >
          ← Voltar para lista
        </button>

        {/* Cabeçalho do Pedido */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Pedido {order.id.substring(0, 8)}...</h2>
            <p className="text-gray-500 text-sm mt-1">Data: {new Date(order.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}</p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              {renderStatusBadge(order.status)}
            </div>
            <p className="text-xl font-bold text-green-700 mt-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalAmount)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Ações Operacionais</h3>
          
          <div className="flex flex-wrap gap-3">
            {order.status === 'Pending' && (
              <button
                disabled={isSubmitting}
                onClick={() => handleAcaoStatus(() => orderService.startPicking(order.id), "Separação iniciada!")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
              >
                Iniciar Separação (Picking)
              </button>
            )}

            {order.status === 'Picking' && (
              <button
                disabled={isSubmitting}
                onClick={() => handleAcaoStatus(() => orderService.startChecking(order.id), "Iniciada conferência do pedido!")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
              >
                Iniciar Conferência (Checking)
              </button>
            )}

            {order.status === 'Checking' && (
              <button
                disabled={isSubmitting}
                onClick={() => handleAcaoStatus(() => orderService.startPacking(order.id), "Pedido em embalagem!")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
              >
                Iniciar Embalagem (Packing)
              </button>
            )}

            {order.status === 'Packing' && (
              <button
                disabled={isSubmitting}
                onClick={() => handleAcaoStatus(() => orderService.ship(order.id), "Pedido expedido com sucesso!")}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
              >
                Expedir Pedido (Ship)
              </button>
            )}

            {order.status === 'Shipped' && (
              <button
                disabled={isSubmitting}
                onClick={() => handleAcaoStatus(() => orderService.deliver(order.id), "Pedido entregue!")}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
              >
                Registrar Entrega (Deliver)
              </button>
            )}

            {order.status !== 'Shipped' && order.status !== 'Delivered' && order.status !== 'Canceled' && (
              <button
                disabled={isSubmitting}
                onClick={async () => {
                  const confirmado = await confirmarExclusao("este pedido (o estoque reservado será liberado)");
                  if (confirmado) {
                    handleAcaoStatus(() => orderService.cancel(order.id), "Pedido cancelado com sucesso.");
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm ml-auto disabled:opacity-50"
              >
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Itens do Pedido & Separação</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto ID</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Solicitado</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Separado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  {order.status === 'Picking' && (
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ação Picking</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 uppercase">
                      {item.productId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-600">
                      {item.pickedQuantity} / {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice)}
                    </td>

                    {order.status === 'Picking' && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {item.pickedQuantity < item.quantity ? (
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max={item.quantity - item.pickedQuantity}
                              value={pickingQuantities[item.id] || ''}
                              onChange={(e) => setPickingQuantities({
                                ...pickingQuantities,
                                [item.id]: Number(e.target.value)
                              })}
                              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Qtd"
                            />
                            <button
                              disabled={isSubmitting}
                              onClick={() => handlePickItem(item.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded transition disabled:opacity-50"
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
        </div>

      </div>
    </div>
  );
}
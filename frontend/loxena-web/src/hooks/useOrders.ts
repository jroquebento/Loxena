import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import type { Order } from '../types/Order';
import { orderService } from '../services/orderService';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const carregarPedidos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar a lista de pedidos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const iniciar = async () => {
      await carregarPedidos();
    };
    iniciar();
  }, [carregarPedidos]);

  return {
    orders,
    isLoading,
    carregarPedidos
  };
}
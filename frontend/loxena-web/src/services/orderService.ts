import type { Order, OrderSummary } from '../types/Order';
import { tratarErro } from '../utils/apiUtils';

const API_URL = "https://localhost:7175/Orders"; 

export type CreateOrderItemPayload = {
  productId: string;
  quantity: number;
};

export type CreateOrderPayload = {
  customerId: string;
  items: CreateOrderItemPayload[];
};

export type PickOrderItemPayload = {
  orderItemId: string;
  quantity: number;
};

export const orderService = {
  getAll: async (): Promise<OrderSummary[]> => {
    const resposta = await fetch(API_URL);
    await tratarErro(resposta, 'Falha ao buscar pedidos');
    return resposta.json();
  },

  getById: async (id: string): Promise<Order> => {
    const resposta = await fetch(`${API_URL}/${id}`);
    await tratarErro(resposta, 'Falha ao buscar detalhes do pedido');
    return resposta.json();
  },

  create: async (data: CreateOrderPayload): Promise<Order> => {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    await tratarErro(resposta, 'Falha ao criar pedido');
    return resposta.json();
  },

  cancel: async (id: string): Promise<void> => {
    const resposta = await fetch(`${API_URL}/${id}/cancel`, { method: 'PATCH' });
    await tratarErro(resposta, 'Falha ao cancelar pedido');
  },

  startPicking: async (id: string): Promise<void> => {
    const resposta = await fetch(`${API_URL}/${id}/start-picking`, { method: 'PATCH' });
    await tratarErro(resposta, 'Falha ao iniciar separação');
  },

  pickItem: async (id: string, payload: PickOrderItemPayload): Promise<void> => {
    const resposta = await fetch(`${API_URL}/${id}/pick`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    await tratarErro(resposta, 'Falha ao registrar separação do item');
  },

  startChecking: async (id: string): Promise<void> => {
    const resposta = await fetch(`${API_URL}/${id}/start-checking`, { method: 'PATCH' });
    await tratarErro(resposta, 'Falha ao iniciar conferência');
  },

  startPacking: async (id: string): Promise<void> => {
    const resposta = await fetch(`${API_URL}/${id}/start-packing`, { method: 'PATCH' });
    await tratarErro(resposta, 'Falha ao iniciar embalagem');
  },

  ship: async (id: string): Promise<void> => {
    const resposta = await fetch(`${API_URL}/${id}/ship`, { method: 'PATCH' });
    await tratarErro(resposta, 'Falha ao expedir pedido');
  },

  deliver: async (id: string): Promise<void> => {
    const resposta = await fetch(`${API_URL}/${id}/deliver`, { method: 'PATCH' });
    await tratarErro(resposta, 'Falha ao registrar entrega do pedido');
  }
};
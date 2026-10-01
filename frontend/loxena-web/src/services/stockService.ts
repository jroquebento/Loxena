import type { Stock } from '../types/Stock';
import { tratarErro } from '../utils/apiUtils';

const API_URL = "https://localhost:7175/Stocks"; 

export type StockMovementPayload = {
  productId: string;
  locationId: string;
  amount: number;
};

export const stockService = {
  getAll: async (): Promise<Stock[]> => {
    const resposta = await fetch(API_URL);
    await tratarErro(resposta, 'Falha ao buscar estoque');
    return resposta.json();
  },

  addQuantity: async (data: StockMovementPayload): Promise<Stock> => {
    const resposta = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    await tratarErro(resposta, 'Falha ao adicionar saldo ao estoque');
    return resposta.json();
  },

  removeQuantity: async (data: StockMovementPayload): Promise<Stock> => {
    const resposta = await fetch(`${API_URL}/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    await tratarErro(resposta, 'Falha ao remover saldo do estoque');
    return resposta.json();
  }
};
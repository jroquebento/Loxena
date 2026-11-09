import type { Customer } from '../types/Customer';
import { tratarErro } from "../utils/apiUtils";

const API_URL = "https://localhost:7175/Customers";

export type CustomerPayload = {
  name: string;
  email: string;
  document: string;
  phone: string;
};

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const resposta = await fetch(API_URL);
    await tratarErro(resposta, 'Falha ao buscar clientes');
    return resposta.json();
  },

  create: async (data: CustomerPayload): Promise<Customer> => {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    await tratarErro(resposta, 'Falha ao criar cliente');
    return resposta.json();
  },

  update: async (id: string, data: CustomerPayload): Promise<Customer> => {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    await tratarErro(resposta, 'Falha ao atualizar cliente');
    return resposta.json();
  },

  delete: async (id: string): Promise<void> => {
    const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    await tratarErro(resposta, 'Falha ao excluir cliente');
  }
};
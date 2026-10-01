import type { Product } from '../types/Product';
import { tratarErro } from "../utils/apiUtils";

const API_URL = "https://localhost:7175/Products";

export type ProductPayload = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
};

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const resposta = await fetch(API_URL);
    await tratarErro(resposta, 'Falha ao buscar produtos');
    return resposta.json();
},
create: async (data: ProductPayload): Promise<Product> => {
  const resposta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(data)
  });
  await tratarErro(resposta, 'Falha ao criar produto');

  return resposta.json();
  },

  update: async (id: string, data: ProductPayload): Promise<Product> =>{
    const resposta = await fetch(`${API_URL}/${id}`,  {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    await tratarErro(resposta, 'Falha ao atualizar produto');
    return resposta.json();
  },

  delete: async (id: string): Promise<void> => {
    const resposta = await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
    await tratarErro(resposta, 'Falha ao excluir produto');
  }
};


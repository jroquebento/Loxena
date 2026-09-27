import type { Product } from '../types/Product';
import { tratarErro } from "../utils/apiUtils";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const resposta = await fetch('https://localhost:7175/Products');
    await tratarErro(resposta, 'Falha ao buscar produtos');
    return resposta.json();
},
create: async (name: string, description: string ,price: number, categoryId: string): Promise<Product> => {
  const resposta = await fetch('https://localhost:7175/Products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({name, description, price, categoryId})
  });
  await tratarErro(resposta, 'Falha ao criar produto');

  return resposta.json();
  },

  update: async (id: string, name: string, description: string ,price: number, categoryId: string): Promise<Product> =>{
    const resposta = await fetch(`https://localhost:7175/Products/${id}`,  {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({name, description, price, categoryId})
    });
    await tratarErro(resposta, 'Falha ao atualizar produto');
    return resposta.json();
  },

  delete: async (id: string): Promise<void> => {
    const resposta = await fetch(`https://localhost:7175/Products/${id}`, {method: 'DELETE'});
    await tratarErro(resposta, 'Falha ao excluir produto');
  }
};


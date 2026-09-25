import type { Product } from '../types/Product';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const resposta = await fetch('https://localhost:7175/Products');
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
  if(!resposta.ok){
    throw new Error('Falha ao criar o produto.');
  }

  return resposta.json();
  }
};

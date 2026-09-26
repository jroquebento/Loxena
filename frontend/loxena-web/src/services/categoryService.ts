import type { Category } from "../types/Category";

const API_URL = "https://localhost:7175/Categories";

export const categoryService = {
    getAll: async () : Promise<Category[]> => {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('Falha ao buscar categorias');
        return resposta.json();
    },

    create: async (name:string): Promise<Category> => {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ name })               
        });
       if (!resposta.ok) throw new Error('Falha ao criar categoria');
        return resposta.json();
    },

    update: async (id: string, name: string): Promise<Category> => {
        const resposta = await fetch(`${API_URL}/${id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name})
        });
         if (!resposta.ok) throw new Error('Falha ao atualizar categoria');
        return resposta.json();
    },

    delete: async (id: string): Promise<void> => {
        const resposta = await fetch(`${API_URL}/${id}` , {
            method: 'DELETE'
        })
        if (!resposta.ok) {
            const erroData = await resposta.json().catch(() => null);
            
        if (erroData && erroData.mensagem){
            throw new Error(erroData.mensagem);
        }
            throw new Error('Falha ao excluir categoria');

        }
    }
};
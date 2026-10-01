import type { Category } from "../types/Category";
import { tratarErro } from "../utils/apiUtils";

const API_URL = "https://localhost:7175/Categories";

export type CategoryPayload = {
    name: string;
};

export const categoryService = {
    getAll: async () : Promise<Category[]> => {
        const resposta = await fetch(API_URL);
        await tratarErro(resposta, 'Falha ao buscar categorias');
        return resposta.json();
    },

    create: async (data: CategoryPayload): Promise<Category> => {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(data)               
        });
        await tratarErro(resposta, 'Falha ao criar categoria');
        return resposta.json();
    },

    update: async (id: string, data: CategoryPayload): Promise<Category> => {
        const resposta = await fetch(`${API_URL}/${id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        await tratarErro(resposta, 'Falha ao atualizar categoria');
        return resposta.json();
    },

    delete: async (id: string): Promise<void> => {
        const resposta = await fetch(`${API_URL}/${id}` , {method: 'DELETE'});
        await tratarErro(resposta, 'Falha ao excluir categoria');
    }
};
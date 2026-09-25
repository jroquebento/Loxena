import type { Category } from "../types/Category";

export const categoryService = {
    getAll: async () : Promise<Category[]> => {
        const resposta = await fetch("https://localhost:7175/Categories")
        return resposta.json();
    }
};
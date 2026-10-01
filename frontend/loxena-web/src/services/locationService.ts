import type { Location } from "../types/Location";
import { tratarErro } from "../utils/apiUtils";

const API_URL = "https://localhost:7175/Locations";

export type LocationPayload = {
    code: string;
    description: string;
};

export const locationService = {
    getAll: async () : Promise<Location[]> => {
        const resposta = await fetch(API_URL);
        await tratarErro(resposta, 'Falha ao buscar localizações');
        return resposta.json();
    },

    create: async (data: LocationPayload): Promise<Location> => {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(data)               
        });
        await tratarErro(resposta, 'Falha ao criar localização');
        return resposta.json();
    },

    update: async (id: string, data: LocationPayload): Promise<Location> => {
        const resposta = await fetch(`${API_URL}/${id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        await tratarErro(resposta, 'Falha ao atualizar localização');
        return resposta.json();
    },

    delete: async (id: string): Promise<void> => {
        const resposta = await fetch(`${API_URL}/${id}` , {method: 'DELETE'});
        await tratarErro(resposta, 'Falha ao excluir localização');
    }
};
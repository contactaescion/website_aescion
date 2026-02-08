import { client } from './client';

export interface Popup {
    id: number;
    title: string;
    image_url: string;
    is_active: boolean;
    start_date: string;
    end_date: string;
}

export const popups = {
    getAll: async () => {
        const response = await client.get<Popup[]>('/popups');
        return response.data;
    },
    getActive: async () => {
        const response = await client.get<Popup[]>('/popups/active');
        return response.data;
    },
    delete: async (id: number) => {
        const response = await client.delete(`/popups/${id}`);
        return response.data;
    },
    toggleActive: async (id: number) => {
        const response = await client.patch(`/popups/${id}/toggle`);
        return response.data;
    }
};

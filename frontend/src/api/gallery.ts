import { client } from './client';

export interface GalleryImage {
    id: number;
    title: string;
    description: string;
    category: string;
    public_url: string;
    thumb_url: string;
    is_featured: boolean;
}

export const gallery = {
    getAll: async () => {
        const response = await client.get<GalleryImage[]>('/gallery');
        return response.data;
    },
    delete: async (id: number) => {
        const response = await client.delete(`/gallery/${id}`);
        return response.data;
    },
    // Add other methods as needed
};

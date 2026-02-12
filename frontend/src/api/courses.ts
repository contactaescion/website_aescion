import { client } from './client';

export interface Course {
    id: number;
    title: string;
    duration: string;
    fees: string;
    mode: string;
    is_featured: boolean;
    code_snippet?: string;
    placement_support: boolean;
    // Add other fields as per backend entity if needed
}

export const courses = {
    getAll: async () => {
        const response = await client.get('/courses');
        // backend may return either an array or a paginated object { items, total, page }
        const data = response.data as any;
        if (Array.isArray(data)) return data as Course[];
        if (data && Array.isArray(data.items)) return data.items as Course[];
        return [] as Course[];
    },
    getOne: async (id: number) => {
        const response = await client.get<Course>(`/courses/${id}`);
        return response.data;
    },
    create: async (data: Partial<Course>) => {
        const response = await client.post<Course>('/courses', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Course>) => {
        const response = await client.patch<Course>(`/courses/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await client.delete(`/courses/${id}`);
        return response.data;
    },
};

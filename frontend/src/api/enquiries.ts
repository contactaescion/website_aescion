import { client } from './client';

export interface Enquiry {
    id: number;
    name: string;
    phone: string;
    email: string;
    course_interest: string;
    message: string;
    created_at: string;
    status: 'NEW' | 'CONTACTED' | 'CLOSED';
}

export const enquiries = {
    create: async (data: Partial<Enquiry>) => {
        const response = await client.post('/enquiries', data);
        return response.data;
    },
    getAll: async () => {
        const response = await client.get<Enquiry[]>('/enquiries');
        return response.data;
    },
    updateStatus: async (id: number, status: string) => {
        const response = await client.post(`/enquiries/${id}/status`, { status });
        return response.data;
    }
};

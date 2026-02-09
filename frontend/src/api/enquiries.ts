import { client } from './client';

export interface Enquiry {
    id: number;
    name: string;
    phone: string;
    email: string;
    course_interest: string;
    message: string;
    created_at: string;
    status: 'NEW' | 'CONTACTED' | 'CLOSED' | 'FOLLOW_UP' | 'CONVERTED';
    type?: 'TRAINING' | 'HR';
    source?: string;
    assigned_to?: number;
    notes?: string[];
    session_id?: string;
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
    },
    assign: async (id: number, assigned_to: number) => {
        const response = await client.post(`/enquiries/${id}/assign`, { assigned_to });
        return response.data;
    },
    addNote: async (id: number, note: string) => {
        const response = await client.post(`/enquiries/${id}/notes`, { note });
        return response.data;
    }
};

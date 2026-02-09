import { client } from './client';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const users = {
    getAll: async () => {
        const response = await client.get<User[]>('/users');
        return response.data;
    }
};

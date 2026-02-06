import { client } from './client';

export const auth = {
    login: async (email: string, password: string) => {
        const response = await client.post('/auth/login', { email, password });
        return response.data;
    },
    getProfile: async () => {
        const response = await client.get('/auth/profile');
        return response.data;
    },
};

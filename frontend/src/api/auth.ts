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
    forgotPassword: async (email: string) => {
        const response = await client.post('/auth/forgot-password', { email });
        return response.data;
    },
    resetPassword: async (token: string, newPassword: string) => {
        const response = await client.post('/auth/reset-password', { token, newPassword });
        return response.data;
    }
};

import axios from 'axios';

const apiEnv = import.meta.env.VITE_API_URL;
const baseURL = apiEnv ? (apiEnv.startsWith('http') ? apiEnv : `https://${apiEnv}`) : 'http://localhost:3000';

export const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Session ID for analytics
        let sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem('session_id', sessionId);
        }
        config.headers['x-session-id'] = sessionId;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('access_token');
            // Optional: Redirect to login or dispatch event
        }
        return Promise.reject(error);
    }
);

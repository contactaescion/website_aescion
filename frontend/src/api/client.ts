import axios from 'axios';

const apiEnv = import.meta.env.VITE_API_URL || import.meta.env.VITE_PUBLIC_API_URL;
const baseURL = apiEnv ? (apiEnv.startsWith('http') ? apiEnv : `https://${apiEnv}`) : 'http://localhost:3000';

const client = axios.create({
    baseURL,
    timeout: 15000,
    withCredentials: true, // required for refresh cookie flow
    headers: {
        'Content-Type': 'application/json',
    },
});

// attach analytics and bearer token
client.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('session_id', sessionId);
    }
    config.headers = config.headers || {};
    config.headers['x-session-id'] = sessionId;
    return config;
});

// Response interceptor with refresh queue
let isRefreshing = false;
let failedQueue: Array<{ resolve: (val?: any) => void; reject: (err: any) => void; config: any }> = [];

const processQueue = (err: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject, config }) => {
        if (err) reject(err);
        else {
            if (token) config.headers.Authorization = `Bearer ${token}`;
            resolve(client(config));
        }
    });
    failedQueue = [];
};

client.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        if (!original) return Promise.reject(error);

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: original });
                });
            }

            isRefreshing = true;
            try {
                const refresh = await axios.post(
                    `${baseURL.replace(/\/$/, '')}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );
                const newToken = refresh.data?.access_token || refresh.data?.accessToken;
                if (newToken) {
                    sessionStorage.setItem('access_token', newToken);
                    original.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    return client(original);
                }
                throw new Error('Refresh did not return access token');
            } catch (e) {
                processQueue(e, null);
                sessionStorage.removeItem('access_token');
                window.location.href = '/admin/login';
                return Promise.reject(e);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export { client };


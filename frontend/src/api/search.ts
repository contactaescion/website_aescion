import { client } from './client';

export const search = {
    // Search query
    query: (q: string) => client.get(`/search?q=${encodeURIComponent(q)}`).then(res => res.data),
};

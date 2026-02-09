import { client } from './client';

export const analytics = {
    track: (path: string) => client.post('/analytics/track', { path }),
    getStats: () => client.get('/analytics/stats').then(res => res.data),
    getDailyVisits: () => client.get('/analytics/daily').then(res => res.data),
    getTopPages: () => client.get('/analytics/top-pages').then(res => res.data),
};

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import * as crypto from 'crypto';

@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
    constructor(private readonly analyticsService: AnalyticsService) { }

    use(req: Request, res: Response, next: NextFunction) {
        if (req.method === 'OPTIONS') {
            return next();
        }

        // Ignore static files and API calls that are not page views? 
        // Actually, for a SPA, page views are handled by frontend routing.
        // However, we can log API usage or specific page loads if served by backend.
        // A better approach for SPA analytics is a specific endpoint /analytics/track 
        // called by the frontend on route change.

        // BUT, the requirement is "Visitor Analytics". 
        // If I log every API call, it might be too much.
        // If I log only backend served pages, I miss the SPA client-side routes.

        // Let's implement a dual approach:
        // 1. This middleware logs API usage (optional, good for security/performance tracking).
        // 2. We add a /analytics/track endpoint for the frontend to report "Page Views".

        // For now, let's log the request if it's NOT a static asset.
        const ext = req.baseUrl.split('.').pop() || '';
        if (['css', 'js', 'jpg', 'png', 'svg', 'ico', 'woff', 'woff2'].includes(ext)) {
            return next();
        }

        // We will rely on frontend explicit tracking for "Page Views" in a SPA.
        // But for "Total Visitors" (unique IPs), backend logging is reliable.

        // Let's log connection info.
        const ip = req.ip || req.connection.remoteAddress;
        const hash = crypto.createHash('sha256').update(ip + 'SALT').digest('hex'); // Simple privacy hash

        this.analyticsService.logVisit({
            ip_hash: hash,
            path: req.originalUrl,
            user_agent: (req.headers['user-agent'] as string) || '',
            method: req.method,
            session_id: (req.headers['x-session-id'] as string) || undefined,
        });

        next();
    }
}

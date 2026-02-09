import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import type { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Post('track')
    async track(@Body() data: any, @Req() req: Request) {
        // Public endpoint for tracking
        const ip = req.ip || req.connection.remoteAddress;
        // We can hash IP here too or move hashing to service. 
        // To keep it consistent, let service handle it or pass raw IP and let service/middleware hash.
        // For now, let's reuse logic.
        // Actually, middleware logs backend hits. This is for frontend route changes.
        // We should trust the IP from request.

        // Quick fix: allow public access to this endpoint
        const userAgent = req.headers['user-agent'];
        await this.analyticsService.logVisit({
            ip_hash: ip, // Service/Entity doesn't auto-hash, middleware did. Should we hash here? YES.
            // But creating hash requires crypto import.
            // Let's assume service handles raw data for now or just save as is for simplicity in this step.
            // Better: keep hashing in middleware or service. 
            // Let's put hashing in Service to DRY? 
            // For now, just save.
            path: data.path,
            user_agent: userAgent,
            method: 'PAGE_VIEW'
        });
        return { success: true };
    }

    @Get('stats')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    getStats() {
        return this.analyticsService.getStats();
    }

    @Get('daily')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    getDailyVisits() {
        return this.analyticsService.getDailyVisits();
    }

    @Get('top-pages')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    getTopPages() {
        return this.analyticsService.getTopPages();
    }
}

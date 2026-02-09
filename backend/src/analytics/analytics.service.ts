import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitorLog } from './entities/visitor-log.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(VisitorLog)
        private readonly visitorLogRepository: Repository<VisitorLog>,
    ) { }

    async logVisit(data: Partial<VisitorLog>) {
        const log = this.visitorLogRepository.create(data);
        return this.visitorLogRepository.save(log);
    }

    async getStats() {
        const totalVisits = await this.visitorLogRepository.count();

        // Unique visitors (by IP)
        const uniqueVisitorsQuery = await this.visitorLogRepository
            .createQueryBuilder('log')
            .select('COUNT(DISTINCT log.ip_hash)', 'count')
            .getRawOne();

        return {
            totalVisits,
            uniqueVisitors: parseInt(uniqueVisitorsQuery.count, 10),
        };
    }

    async getDailyVisits() {
        // Group by date (sqlite/mysql compatible date function needed, using simple string extraction for now or standard SQL)
        // For wider compatibility (SQLite/MySQL), we can return raw data or use specific functions.
        // Let's use a simple approach: fetch last 7 days and aggregate in JS to avoid DB dialect issues for now, or use generic SQL.

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const logs = await this.visitorLogRepository
            .createQueryBuilder('log')
            .where('log.visited_at >= :date', { date: sevenDaysAgo })
            .getMany();

        const grouped = logs.reduce((acc, log) => {
            const date = log.visited_at.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(grouped).map(([date, count]) => ({ date, count }));
    }

    async getTopPages() {
        const result = await this.visitorLogRepository
            .createQueryBuilder('log')
            .select('log.path', 'path')
            .addSelect('COUNT(log.id)', 'count')
            .groupBy('log.path')
            .orderBy('count', 'DESC')
            .limit(5)
            .getRawMany();

        // TypeORM getRawMany returns strings for counts usually
        return result.map(r => ({ path: r.path, count: parseInt(r.count, 10) }));
    }
}

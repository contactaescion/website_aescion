import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitorLog } from './entities/visitor-log.entity';
import { Enquiry } from '../enquiries/entities/enquiry.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(VisitorLog)
        private readonly visitorLogRepository: Repository<VisitorLog>,
        @InjectRepository(Enquiry)
        private readonly enquiryRepository: Repository<Enquiry>,
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
    async getConversionStats() {
        // Total unique visitors
        const uniqueVisitors = await this.visitorLogRepository
            .createQueryBuilder('log')
            .select('COUNT(DISTINCT log.session_id)', 'count')
            .where('log.session_id IS NOT NULL')
            .getRawOne();

        // If session_id is new, we might have 0. Fallback to IP hash?
        // Let's use IP hash for now as session_id is just rolling out.
        const uniqueIPs = await this.visitorLogRepository
            .createQueryBuilder('log')
            .select('COUNT(DISTINCT log.ip_hash)', 'count')
            .getRawOne();

        const visitorsCount = parseInt(uniqueVisitors.count, 10) || parseInt(uniqueIPs.count, 10) || 0;

        // Total Enquiries
        // Ideally should be injected, but circular dependency if I inject EnquiriesService?
        // Actually AnalyticsModule doesn't import EnquiriesModule.
        // I can just query the table if I import the Entity?
        // Or cleaner: AnalyticsController calls both services and aggregates?
        // Or I can add a method here that takes enquiry count?

        return {
            visitors: visitorsCount,
            enquiries: 0, // Placeholder or fetch real count if needed here
            conversionRate: 0 // Placeholder
        };
    }

    async getEnquiriesBySource() {
        const result = await this.enquiryRepository
            .createQueryBuilder('enquiry')
            .select('enquiry.source', 'source')
            .addSelect('COUNT(enquiry.id)', 'count')
            .groupBy('enquiry.source')
            .getRawMany();

        // normalize null source
        return result.map(r => ({
            name: r.source || 'Direct/Unknown',
            value: parseInt(r.count, 10)
        }));
    }
}

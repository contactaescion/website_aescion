import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { VisitorLog } from './entities/visitor-log.entity';
import { AnalyticsMiddleware } from './analytics.middleware';

import { Enquiry } from '../enquiries/entities/enquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorLog, Enquiry])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AnalyticsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

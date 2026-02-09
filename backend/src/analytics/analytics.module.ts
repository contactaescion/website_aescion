import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { VisitorLog } from './entities/visitor-log.entity';
import { AnalyticsMiddleware } from './analytics.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorLog])],
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

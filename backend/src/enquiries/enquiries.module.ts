import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnquiriesService } from './enquiries.service';
import { EnquiriesController } from './enquiries.controller';
import { Enquiry } from './entities/enquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enquiry])],
  controllers: [EnquiriesController],
  providers: [EnquiriesService],
})
export class EnquiriesModule { }

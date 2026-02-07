import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enquiry } from './entities/enquiry.entity';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class EnquiriesService {
    constructor(
        @InjectRepository(Enquiry)
        private repo: Repository<Enquiry>,
        private mailService: MailService,
    ) { }

    async create(dto: CreateEnquiryDto) {
        const enquiry = await this.repo.save(this.repo.create(dto));

        // Send email notification using the centralized mail service
        const emailSent = await this.mailService.sendEnquiryNotification(dto);
        if (!emailSent) {
            // Log warning but do not throw error to avoid failing the enquiry submission
            console.warn(`WARNING: Enquiry saved (ID: ${enquiry.id}) but email notification FAILED to send.`);
        }

        return enquiry;
    }

    findAll() {
        return this.repo.find({ order: { created_at: 'DESC' } });
    }

    async updateStatus(id: number, status: string) {
        await this.repo.update(id, { status });
        return this.repo.findOne({ where: { id } });
    }
}

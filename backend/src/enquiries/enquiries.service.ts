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
        const updated = await this.repo.findOne({ where: { id } });
        return updated;
    }

    async assign(id: number, assignedTo: number) {
        await this.repo.update(id, { assigned_to: assignedTo });
        return this.repo.findOne({ where: { id } });
    }

    async addNote(id: number, note: string) {
        const enquiry = await this.repo.findOne({ where: { id } });
        if (!enquiry) return null;
        const notes = enquiry.notes || [];
        // Add timestamp and user info ideally, but for now just string
        const noteWithTimestamp = `[${new Date().toISOString()}] ${note}`;
        notes.push(noteWithTimestamp);
        await this.repo.update(id, { notes });
        return this.repo.findOne({ where: { id } });
    }

    async remove(id: number) {
        await this.repo.delete(id);
        return { deleted: true };
    }
}

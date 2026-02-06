import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enquiry } from './entities/enquiry.entity';
import * as nodemailer from 'nodemailer';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Injectable()
export class EnquiriesService {
    private transporter;

    constructor(
        @InjectRepository(Enquiry)
        private repo: Repository<Enquiry>,
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async create(dto: CreateEnquiryDto) {
        const enquiry = await this.repo.save(this.repo.create(dto));

        // Send email notification
        try {
            await this.transporter.sendMail({
                from: '"AESCION Website" <contact.aescion@gmail.com>',
                to: 'contact.aescion@gmail.com',
                subject: `New Enquiry from ${dto.name}`,
                html: `
                    <h3>New Enquiry Details</h3>
                    <p><strong>Name:</strong> ${dto.name}</p>
                    <p><strong>Phone:</strong> ${dto.phone}</p>
                    <p><strong>Email:</strong> ${dto.email || 'N/A'}</p>
                    <p><strong>Course Interest:</strong> ${dto.course_interest || 'N/A'}</p>
                    <p><strong>Message:</strong></p>
                    <p>${dto.message || 'No message provided.'}</p>
                `,
            });
            console.log('Enquiry email sent successfully.');
        } catch (error) {
            console.error('Failed to send enquiry email:', error);
            // Don't fail the request if email fails
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

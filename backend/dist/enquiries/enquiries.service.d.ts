import { Repository } from 'typeorm';
import { Enquiry } from './entities/enquiry.entity';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { MailService } from '../mail/mail.service';
export declare class EnquiriesService {
    private repo;
    private mailService;
    constructor(repo: Repository<Enquiry>, mailService: MailService);
    create(dto: CreateEnquiryDto): Promise<Enquiry>;
    findAll(): Promise<Enquiry[]>;
    updateStatus(id: number, status: string): Promise<Enquiry | null>;
    assign(id: number, assignedTo: number): Promise<Enquiry | null>;
    addNote(id: number, note: string): Promise<Enquiry | null>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}

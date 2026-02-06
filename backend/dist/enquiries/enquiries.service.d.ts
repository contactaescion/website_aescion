import { Repository } from 'typeorm';
import { Enquiry } from './entities/enquiry.entity';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
export declare class EnquiriesService {
    private repo;
    private transporter;
    constructor(repo: Repository<Enquiry>);
    create(dto: CreateEnquiryDto): Promise<Enquiry>;
    findAll(): Promise<Enquiry[]>;
    updateStatus(id: number, status: string): Promise<Enquiry | null>;
}

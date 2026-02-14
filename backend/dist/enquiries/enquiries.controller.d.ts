import { EnquiriesService } from './enquiries.service';
export declare class EnquiriesController {
    private readonly service;
    constructor(service: EnquiriesService);
    create(dto: any): Promise<import("./entities/enquiry.entity").Enquiry>;
    findAll(): Promise<import("./entities/enquiry.entity").Enquiry[]>;
    updateStatus(body: {
        status: string;
    }, id: number): Promise<import("./entities/enquiry.entity").Enquiry | null>;
    assign(body: {
        assigned_to: number;
    }, id: number): Promise<import("./entities/enquiry.entity").Enquiry | null>;
    addNote(body: {
        note: string;
    }, id: number): Promise<import("./entities/enquiry.entity").Enquiry | null>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}

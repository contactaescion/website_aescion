"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const enquiry_entity_1 = require("./entities/enquiry.entity");
const mail_service_1 = require("../mail/mail.service");
let EnquiriesService = class EnquiriesService {
    repo;
    mailService;
    constructor(repo, mailService) {
        this.repo = repo;
        this.mailService = mailService;
    }
    async create(dto) {
        const enquiry = await this.repo.save(this.repo.create(dto));
        const emailSent = await this.mailService.sendEnquiryNotification(dto);
        if (!emailSent) {
            console.warn(`WARNING: Enquiry saved (ID: ${enquiry.id}) but email notification FAILED to send.`);
        }
        return enquiry;
    }
    findAll() {
        return this.repo.find({ order: { created_at: 'DESC' } });
    }
    async updateStatus(id, status) {
        await this.repo.update(id, { status });
        const updated = await this.repo.findOne({ where: { id } });
        return updated;
    }
    async assign(id, assignedTo) {
        await this.repo.update(id, { assigned_to: assignedTo });
        return this.repo.findOne({ where: { id } });
    }
    async addNote(id, note) {
        const enquiry = await this.repo.findOne({ where: { id } });
        if (!enquiry)
            return null;
        const notes = enquiry.notes || [];
        const noteWithTimestamp = `[${new Date().toISOString()}] ${note}`;
        notes.push(noteWithTimestamp);
        await this.repo.update(id, { notes });
        return this.repo.findOne({ where: { id } });
    }
};
exports.EnquiriesService = EnquiriesService;
exports.EnquiriesService = EnquiriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(enquiry_entity_1.Enquiry)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService])
], EnquiriesService);
//# sourceMappingURL=enquiries.service.js.map
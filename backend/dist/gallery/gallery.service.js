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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gallery_entity_1 = require("./entities/gallery.entity");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
let GalleryService = class GalleryService {
    galleryRepository;
    configService;
    s3Client;
    bucketName;
    constructor(galleryRepository, configService) {
        this.galleryRepository = galleryRepository;
        this.configService = configService;
        const region = this.configService.get('AWS_REGION');
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        const bucket = this.configService.get('AWS_S3_BUCKET');
        this.s3Client = new client_s3_1.S3Client({
            region: region || 'us-east-1',
            credentials: {
                accessKeyId: accessKeyId || '',
                secretAccessKey: secretAccessKey || '',
            },
        });
        this.bucketName = bucket || 'aescion-gallery';
        if (!accessKeyId || !secretAccessKey) {
            console.warn('AWS credentials are not fully defined. S3 functionality might be limited.');
        }
    }
    async uploadFile(file, title, description, category) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const key = `gallery/${(0, uuid_1.v4)()}-${file.originalname}`;
        const isMock = this.configService.get('AWS_ACCESS_KEY_ID') === 'mock_key';
        let publicUrl = '';
        if (isMock) {
            console.log('Mock S3 Upload (Saving Locally):', key);
            const fs = require('fs');
            const path = require('path');
            const uploadDir = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            const fileName = `${(0, uuid_1.v4)()}-${file.originalname}`;
            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, file.buffer);
            const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
            publicUrl = `${baseUrl}/uploads/${fileName}`;
        }
        else {
            await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            }));
            publicUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
        }
        const image = this.galleryRepository.create({
            title,
            description,
            category,
            s3_key: key,
            public_url: publicUrl,
            thumb_url: publicUrl,
        });
        return this.galleryRepository.save(image);
    }
    findAll() {
        return this.galleryRepository.find({ order: { created_at: 'DESC' } });
    }
    async remove(id) {
        const image = await this.galleryRepository.findOne({ where: { id } });
        if (!image)
            throw new common_1.NotFoundException('Image not found');
        const isMock = this.configService.get('AWS_ACCESS_KEY_ID') === 'mock_key';
        if (!isMock) {
            try {
                await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
                    Bucket: this.bucketName,
                    Key: image.s3_key,
                }));
            }
            catch (e) {
                console.error('S3 Delete Error', e);
            }
        }
        return this.galleryRepository.remove(image);
    }
    async update(id, updateDto) {
        await this.galleryRepository.update(id, updateDto);
        return this.galleryRepository.findOne({ where: { id } });
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gallery_entity_1.GalleryImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map
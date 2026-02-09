"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopupsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const popup_entity_1 = require("./entities/popup.entity");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let PopupsService = class PopupsService {
    popupsRepository;
    configService;
    s3Client;
    bucketName;
    constructor(popupsRepository, configService) {
        this.popupsRepository = popupsRepository;
        this.configService = configService;
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get('AWS_REGION') || 'us-east-1',
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
            },
        });
        this.bucketName = this.configService.get('AWS_S3_BUCKET') || 'aescion-gallery';
    }
    async create(file, title) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const key = `popups/${(0, uuid_1.v4)()}-${file.originalname}`;
        const isMock = this.configService.get('AWS_ACCESS_KEY_ID') === 'mock_key';
        let publicUrl = '';
        if (isMock) {
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
        const popup = this.popupsRepository.create({
            title,
            image_url: publicUrl,
            s3_key: key,
            is_active: false
        });
        return this.popupsRepository.save(popup);
    }
    findAll() {
        return this.popupsRepository.find({ order: { created_at: 'DESC' } });
    }
    async findActive() {
        return this.popupsRepository.findOne({ where: { is_active: true } });
    }
    async toggleActive(id) {
        const popup = await this.popupsRepository.findOne({ where: { id } });
        if (!popup)
            throw new common_1.NotFoundException('Popup not found');
        if (!popup.is_active) {
            await this.popupsRepository.update({ is_active: true }, { is_active: false });
        }
        popup.is_active = !popup.is_active;
        return this.popupsRepository.save(popup);
    }
    async remove(id) {
        const popup = await this.popupsRepository.findOne({ where: { id } });
        if (!popup)
            throw new common_1.NotFoundException('Popup not found');
        const isMock = this.configService.get('AWS_ACCESS_KEY_ID') === 'mock_key';
        if (!isMock && popup.s3_key) {
            try {
                await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
                    Bucket: this.bucketName,
                    Key: popup.s3_key,
                }));
            }
            catch (e) {
                console.error('S3 Delete Error', e);
            }
        }
        else {
            try {
                if (popup.image_url && popup.image_url.includes('/uploads/')) {
                    const fileName = popup.image_url.split('/uploads/')[1];
                    const uploadDir = path.join(process.cwd(), 'uploads');
                    const filePath = path.join(uploadDir, fileName);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
            catch (e) {
                console.error('Local File Delete Error', e);
            }
        }
        return this.popupsRepository.remove(popup);
    }
};
exports.PopupsService = PopupsService;
exports.PopupsService = PopupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(popup_entity_1.Popup)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], PopupsService);
//# sourceMappingURL=popups.service.js.map
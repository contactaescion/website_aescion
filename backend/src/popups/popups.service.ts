import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Popup } from './entities/popup.entity';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PopupsService {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(
        @InjectRepository(Popup)
        private popupsRepository: Repository<Popup>,
        private configService: ConfigService,
    ) {
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
            },
        });
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || 'aescion-gallery';
    }

    async create(file: Express.Multer.File, title: string) {
        if (!file) throw new BadRequestException('No file uploaded');

        const key = `popups/${uuidv4()}-${file.originalname}`;
        const isMock = this.configService.get<string>('AWS_ACCESS_KEY_ID') === 'mock_key';

        let publicUrl = '';

        if (isMock) {
            // Save locally
            const uploadDir = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            const fileName = `${uuidv4()}-${file.originalname}`;
            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, file.buffer);

            const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
            publicUrl = `${baseUrl}/uploads/${fileName}`;
        } else {
            // Upload to S3
            await this.s3Client.send(new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            }));
            publicUrl = `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
        }

        const popup = this.popupsRepository.create({
            title,
            image_url: publicUrl,
            s3_key: key,
            is_active: false // Default to inactive
        });

        return this.popupsRepository.save(popup);
    }

    findAll() {
        return this.popupsRepository.find({ order: { created_at: 'DESC' } });
    }

    async findActive() {
        return this.popupsRepository.findOne({ where: { is_active: true } });
    }

    async toggleActive(id: number) {
        const popup = await this.popupsRepository.findOne({ where: { id } });
        if (!popup) throw new NotFoundException('Popup not found');

        // If activating this one, deactivate others? 
        // Or allowing multiple active? Usually one popup at a time.
        // Let's enforce single active popup for simplicity.
        if (!popup.is_active) {
            await this.popupsRepository.update({ is_active: true }, { is_active: false });
        }

        popup.is_active = !popup.is_active;
        return this.popupsRepository.save(popup);
    }

    async remove(id: number) {
        const popup = await this.popupsRepository.findOne({ where: { id } });
        if (!popup) throw new NotFoundException('Popup not found');

        const isMock = this.configService.get<string>('AWS_ACCESS_KEY_ID') === 'mock_key';

        if (!isMock && popup.s3_key) {
            try {
                await this.s3Client.send(new DeleteObjectCommand({
                    Bucket: this.bucketName,
                    Key: popup.s3_key,
                }));
            } catch (e) {
                console.error('S3 Delete Error', e);
            }
        }

        return this.popupsRepository.remove(popup);
    }
}

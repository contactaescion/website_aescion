import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryImage, GalleryCategory } from './entities/gallery.entity';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GalleryService {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(
        @InjectRepository(GalleryImage)
        private galleryRepository: Repository<GalleryImage>,
        private configService: ConfigService,
    ) {
        const region = this.configService.get<string>('AWS_REGION');
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
        const bucket = this.configService.get<string>('AWS_S3_BUCKET');

        this.s3Client = new S3Client({
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

    async uploadFile(file: Express.Multer.File, title: string, description: string, category: GalleryCategory) {
        if (!file) throw new BadRequestException('No file uploaded');

        const key = `gallery/${uuidv4()}-${file.originalname}`;
        const isMock = this.configService.get<string>('AWS_ACCESS_KEY_ID') === 'mock_key';

        let publicUrl = '';
        if (isMock) {
            console.log('Mock S3 Upload (Saving Locally):', key);
            // publicUrl = 'https://via.placeholder.com/600x400';

            // Save locally
            const fs = require('fs');
            const path = require('path');
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
            await this.s3Client.send(new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            }));
            publicUrl = `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
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

    async remove(id: number) {
        const image = await this.galleryRepository.findOne({ where: { id } });
        if (!image) throw new NotFoundException('Image not found');

        const isMock = this.configService.get<string>('AWS_ACCESS_KEY_ID') === 'mock_key';

        if (!isMock) {
            try {
                await this.s3Client.send(new DeleteObjectCommand({
                    Bucket: this.bucketName,
                    Key: image.s3_key,
                }));
            } catch (e) {
                console.error('S3 Delete Error', e);
            }
        } else {
            // Handle local file deletion
            try {
                const fs = require('fs');
                const path = require('path');
                // Construct the file path from the public_url or s3_key
                // Since we stored s3_key as the filename in mock mode (mostly), let's try to infer
                // But s3_key might be 'local-seed-...' which doesn't correspond to a file in uploads
                // If it's a seed image, we might skip deleting the file or check if it exists in uploads.

                // If public_url contains 'uploads/', it is likely a locally uploaded file
                if (image.public_url.includes('/uploads/')) {
                    const fileName = image.public_url.split('/uploads/')[1];
                    const filePath = path.join(process.cwd(), 'uploads', fileName);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            } catch (e) {
                console.error('Local File Delete Error', e);
            }
        }

        return this.galleryRepository.remove(image);
    }

    async update(id: number, updateDto: Partial<GalleryImage>) {
        await this.galleryRepository.update(id, updateDto);
        return this.galleryRepository.findOne({ where: { id } });
    }
}

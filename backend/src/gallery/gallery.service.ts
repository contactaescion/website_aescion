import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryImage, GalleryCategory } from './entities/gallery.entity';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
            region: region || 'eu-north-1',
            credentials: {
                accessKeyId: accessKeyId || '',
                secretAccessKey: secretAccessKey || '',
            },
        });
        this.bucketName = bucket || 'aescion-gallery';

        if (!region || region !== 'eu-north-1') {
            console.log(`[GalleryService] Initializing S3 with region: ${region || 'eu-north-1'}. Buckets in 'eu-north-1' require the correct region setting.`);
        }

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
            try {
                await this.s3Client.send(new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                }));
                // We store the key, but public_url will be generated dynamically
                publicUrl = `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
            } catch (error) {
                console.error('S3 Upload Error:', error);
                throw new Error(`S3 Upload Failed: ${error.message} (Bucket: ${this.bucketName}, Region: ${this.configService.get<string>('AWS_REGION')})`);
            }
        }

        const image = this.galleryRepository.create({
            title,
            description,
            category,
            s3_key: key,
            public_url: publicUrl, // Stored for reference/mock, but overridden on fetch for S3
            thumb_url: publicUrl,
        });
        await this.galleryRepository.save(image);
        return this.signImage(image);
    }

    async findAll() {
        const images = await this.galleryRepository.find({ order: { created_at: 'DESC' } });
        return Promise.all(images.map(img => this.signImage(img)));
    }

    // Public method to generate a presigned URL for a given s3 key
    async getPresignedUrl(key: string, ttlSeconds?: number) {
        if (this.configService.get<string>('AWS_ACCESS_KEY_ID') === 'mock_key') {
            // Return local uploads path if mock
            const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
            return `${baseUrl}/uploads/${key}`;
        }

        const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
        const expiresIn = ttlSeconds || Number(this.configService.get<string>('S3_PRESIGN_TTL') || '3600');
        return await getSignedUrl(this.s3Client, command, { expiresIn });
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
            // ... existing mock delete logic ...
            try {
                const fs = require('fs');
                const path = require('path');
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
        const image = await this.galleryRepository.findOne({ where: { id } });
        return this.signImage(image!);
    }

    async search(query: string) {
        const images = await this.galleryRepository
            .createQueryBuilder('gallery')
            .where('gallery.title LIKE :query OR gallery.description LIKE :query', { query: `%${query}%` })
            .getMany();
        return Promise.all(images.map(img => this.signImage(img)));
    }

    // Helper to generate Signed URL (NOW REPLACED BY PROXY URL)
    private async signImage(image: GalleryImage) {
        const isMock = this.configService.get<string>('AWS_ACCESS_KEY_ID') === 'mock_key';
        if (isMock) {
            return image;
        }

        // Use Proxy URL instead of Signed URL to prevent expiration
        const baseUrl = process.env.API_BASE_URL || 'https://api.aesciontech.com'; // Fallback to prod if env missing, or handle dynamically
        // Use relative path or full path depending on if we want backend to be absolute
        // It's safer to return a relative path if the frontend knows the base, but here we likely want full.
        // Let's assume the frontend API client handles the base URL if we return a relative one? 
        // No, the frontend displays these directly in <img> tags. So we need a full URL.

        // Better: Construct URL based on current host if possible, or config. 
        // For now, let's use the proxy route: /images/proxy/<key>

        // We need to return a URL that the frontend can load.
        // Since the frontend might separate API_URL, we should ideally prepend API_URL.
        // However, we don't have access to the request host easily here without @Inject(REQUEST).
        // Let's rely on a config variable for API_URL or just return the path and let frontend prepend?
        // Existing logic returned a full string `https://${bucket}...`. 
        // So we should return a full string.

        const apiUrl = this.configService.get<string>('API_URL') || 'http://localhost:3000';
        image.public_url = `${apiUrl}/images/proxy/${image.s3_key}`;
        image.thumb_url = `${apiUrl}/images/proxy/${image.s3_key}`;

        return image;
    }
}

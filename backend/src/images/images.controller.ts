import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Controller('images')
export class ImagesController {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        const region = this.configService.get<string>('AWS_REGION');
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || 'aescion-gallery';

        this.s3Client = new S3Client({
            region: region || 'us-east-1',
            credentials: {
                accessKeyId: accessKeyId || '',
                secretAccessKey: secretAccessKey || '',
            },
        });
    }

    @Get('proxy/*key')
    async getProxyImage(@Param('key') key: string, @Res() res: Response) {
        // If mock/dev mode, redirect to local uploads
        const isMock = this.configService.get<string>('AWS_ACCESS_KEY_ID') === 'mock_key';
        if (isMock) {
            return res.redirect(`/uploads/${key}`);
        }

        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const s3Response = await this.s3Client.send(command);

            // Set cache headers - Cache for 1 day
            res.set('Cache-Control', 'public, max-age=86400');

            if (s3Response.ContentType) {
                res.set('Content-Type', s3Response.ContentType);
            }

            if (s3Response.Body) {
                const stream = s3Response.Body as unknown as Readable;
                stream.pipe(res);
            }
        } catch (e) {
            console.error('Proxy Error (S3):', e.message);

            // Fallback: Check local uploads folder
            // This handles the case where we migrated images locally but have S3 creds
            const { join } = require('path');
            const { existsSync, createReadStream } = require('fs');
            const localPath = join(process.cwd(), 'uploads', key);

            if (existsSync(localPath)) {
                // Serve local file
                res.set('Cache-Control', 'public, max-age=86400');
                // Guess content type or let express handle it? 
                // We'll let createReadStream pipe it.
                // Should set content-type if possible.
                if (key.endsWith('.jpg') || key.endsWith('.jpeg')) res.type('image/jpeg');
                if (key.endsWith('.png')) res.type('image/png');

                createReadStream(localPath).pipe(res);
                return;
            }

            throw new NotFoundException('Image not found in S3 or local storage');
        }
    }
}

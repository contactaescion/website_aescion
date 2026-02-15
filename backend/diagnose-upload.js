const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config();

console.log('--- Diagnostic S3 Upload Script ---');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_S3_BUCKET:', process.env.AWS_S3_BUCKET);
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '***' + process.env.AWS_ACCESS_KEY_ID.slice(-4) : 'MISSING');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Present' : 'MISSING');

async function testUpload() {
    const region = 'eu-north-1'; // Testing eu-north-1 based on codebase hints
    const bucket = process.env.AWS_S3_BUCKET || 'aescion-gallery';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
        console.error('Error: Missing credentials in .env');
        return;
    }

    const s3Client = new S3Client({
        region: region,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        },
    });

    const key = `debug-script-${Date.now()}.txt`;
    const body = 'This is a test upload from the diagnostic script.';

    try {
        console.log(`Attempting to upload to bucket "${bucket}" in region "${region}"...`);
        await s3Client.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: 'text/plain',
        }));
        console.log('SUCCESS: File uploaded successfully!');
        console.log(`Key: ${key}`);
    } catch (error) {
        console.error('FAILURE: Upload failed.');
        console.error(`Error Code: ${error.name}`);
        console.error(`Error Message: ${error.message}`);
        // console.error('Full Error:', error); // Commented out to avoid clutter
    }
}

testUpload();

const nodemailer = require('nodemailer');
require('dotenv').config();

async function testMail() {
    console.log('Testing email for user:', process.env.MAIL_USER);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log('SMTP connection verified successfully');

        const info = await transporter.sendMail({
            from: `"AESCION Test" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_USER,
            subject: 'Test Email Verification',
            text: 'This is a test email from the verification script.',
        });
        console.log('Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Email test failed:', error);
    }
}

testMail();

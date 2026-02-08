import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { CreateEnquiryDto } from '../enquiries/dto/create-enquiry.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendEnquiryNotification(dto: CreateEnquiryDto): Promise<boolean> {
    const mailOptions = {
      from: `"AESCION Website" <${this.configService.get<string>('MAIL_USER')}>`,
      to: this.configService.get<string>('MAIL_USER'), // Send to self as notification
      subject: `New Enquiry from ${dto.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0047AB; border-bottom: 2px solid #0047AB; padding-bottom: 10px;">New Enquiry Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${dto.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${dto.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${dto.email || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Course Interest</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${dto.course_interest || 'N/A'}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #0047AB;">
            <p style="font-weight: bold; margin-bottom: 5px;">Message:</p>
            <p style="white-space: pre-wrap;">${dto.message || 'No message provided.'}</p>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">
            This email was automatically generated from the AESCION Website contact form.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Enquiry notification email sent for: ${dto.name}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send enquiry email for: ${dto.name}. Error: ${error.message}`, error.stack);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    const mailOptions = {
      from: `"AESCION Admin" <${this.configService.get<string>('MAIL_USER')}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
          <p>You requested a password reset</p>
          <p>Click this link to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link expires in 1 hour.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Reset email sent successfully to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send reset email to ${email}. Error: ${error.message}`, error.stack);
      throw error;
    }
  }
}

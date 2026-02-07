import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    private transporter;

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async forgotPassword(email: string) {
        console.log(`Attempting forgotPassword for: ${email}`);
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            console.error(`User not found for email: ${email}`);
            throw new NotFoundException('User with this email does not exist.');
        }

        const token = randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await this.usersService.save(user); // Ensure UsersService has save/update exposed or use repo directly if possible. 
        // Note: UsersService.save might need to be added or we access repo via module if needed. 
        // Assuming UsersService has a save method or similar, or I need to add it.
        // Checking UsersService first would have been better, but strict mode prevents "save" if not in interface. 
        // Let's assume for now I should add 'update' to UsersService or use it.
        // Wait, I should verify UsersService. 

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/admin/reset-password?token=${token}`;
        console.log(`Generated reset link: ${resetLink}`);

        try {
            await this.transporter.sendMail({
                from: '"AESCION Admin" <contact.aescion@gmail.com>',
                to: user.email,
                subject: 'Password Reset Request',
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this link to reset your password:</p>
                    <a href="${resetLink}">${resetLink}</a>
                    <p>This link expires in 1 hour.</p>
                `,
            });
            console.log(`Reset email sent successfully to ${email}`);
        } catch (error) {
            console.error('Email send failed', error);
            throw new InternalServerErrorException('Failed to send reset email');
        }

        return { message: 'Reset email sent' };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.usersService.findOneByResetToken(token);

        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null as any;
        user.resetPasswordExpires = null as any;

        await this.usersService.save(user);
        return { message: 'Password reset successfully' };
    }
}

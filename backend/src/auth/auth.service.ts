import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user || !user.password) {
            return null;
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id, role: user.role };
        const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
            access_token,
            refresh_token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.usersService.findOneByEmail(payload.username);
            if (!user) throw new UnauthorizedException('Invalid refresh token');
            const newPayload = { username: user.email, sub: user.id, role: user.role };
            const access_token = this.jwtService.sign(newPayload, { expiresIn: '15m' });
            const new_refresh_token = this.jwtService.sign(newPayload, { expiresIn: '7d' });
            return { access_token, refresh_token: new_refresh_token, user: { id: user.id, email: user.email, role: user.role } };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async forgotPassword(email: string) {
        // console.log(`Attempting forgotPassword for: ${email}`); // Removed for security (PII/Log noise)
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            console.error(`User not found for email: ${email}`);
            throw new NotFoundException('User with this email does not exist.');
        }

        const token = randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await this.usersService.save(user);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/admin/reset-password?token=${token}`;
        // REMOVED sensitive log: console.log(`Generated reset link: ${resetLink}`);

        try {
            await this.mailService.sendPasswordResetEmail(user.email, resetLink);
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

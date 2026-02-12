import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.authService.login(user);
        // Set httpOnly refresh cookie
        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        // Return access token and user info
        return { access_token: tokens.access_token, user: tokens.user };
    }

    @Post('refresh')
    async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
        const token = req.cookies?.refresh_token;
        if (!token) throw new UnauthorizedException('No refresh token');
        const result = await this.authService.refreshTokens(token);
        // Set rotated refresh token as cookie
        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return { access_token: result.access_token };
    }

    @Post('logout')
    async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
        res.clearCookie('refresh_token', { path: '/' });
        return { message: 'Logged out' };
    }

    @Post('forgot-password')
    async forgotPassword(@Body() body: { email: string }) {
        return this.authService.forgotPassword(body.email);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: { token: string; newPassword: string }) {
        return this.authService.resetPassword(body.token, body.newPassword);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}

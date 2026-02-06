"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const nodemailer = __importStar(require("nodemailer"));
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    usersService;
    jwtService;
    transporter;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findOneByEmail(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { username: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async forgotPassword(email) {
        console.log(`Attempting forgotPassword for: ${email}`);
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            console.error(`User not found for email: ${email}`);
            throw new common_1.NotFoundException('User with this email does not exist.');
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await this.usersService.save(user);
        const resetLink = `http://localhost:5173/admin/reset-password?token=${token}`;
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
        }
        catch (error) {
            console.error('Email send failed', error);
            throw new common_1.InternalServerErrorException('Failed to send reset email');
        }
        return { message: 'Reset email sent' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersService.findOneByResetToken(token);
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.usersService.save(user);
        return { message: 'Password reset successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
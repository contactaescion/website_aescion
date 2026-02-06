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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const users_service_1 = require("./users/users.service");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./users/entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
async function bootstrap() {
    console.log('Starting reset-password script...');
    try {
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const usersService = app.get(users_service_1.UsersService);
        const configService = app.get(config_1.ConfigService);
        console.log(`Connected to DB: ${configService.get('DB_DATABASE')} at ${configService.get('DB_HOST')}`);
        const allUsers = await usersService.findAll();
        console.log('--- ALL USERS ---');
        allUsers.forEach(u => console.log(`ID: ${u.id}, Email: '${u.email}', Role: ${u.role}`));
        console.log('-----------------');
        const email = 'contact.aescion@gmail.com';
        const password = 'AESCION@123';
        console.log(`Finding user ${email}...`);
        let user = await usersService.findOneByEmail(email);
        if (!user) {
            console.log('Exact match not found. Checking via iteration...');
            user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
        }
        if (!user) {
            console.log('Checking by name "Super Admin"...');
            user = allUsers.find(u => u.name === 'Super Admin') || null;
            if (user) {
                console.log(`Found user by name 'Super Admin' (ID: ${user.id}). Updating email and password...`);
                user.email = email;
            }
        }
        if (user) {
            console.log('User found. Updating password...');
            user.password = await bcrypt.hash(password, 10);
            await usersService.save(user);
            console.log('✅ Password updated successfully to: ' + password);
        }
        else {
            console.log('⚠️ User not found. Creating new admin user...');
            try {
                await usersService.create({
                    email: email,
                    password: password,
                    name: 'Super Admin',
                    role: user_entity_1.UserRole.SUPER_ADMIN,
                });
                console.log('✅ Admin user created successfully with password: ' + password);
            }
            catch (e) {
                console.error('❌ Failed to create user:', e);
            }
        }
        await app.close();
        console.log('Script finished.');
    }
    catch (err) {
        console.error('❌ Script failed:', err);
    }
}
bootstrap();
//# sourceMappingURL=reset-password.js.map
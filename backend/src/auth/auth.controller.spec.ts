
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        validateUser: jest.fn(),
                        login: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        it('should throw UnauthorizedException if validation fails', async () => {
            jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

            await expect(
                controller.login({ email: 'test@example.com', password: 'wrong' }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should return token if validation succeeds', async () => {
            const user = { id: 1, email: 'test@example.com' };
            const token = { access_token: 'jwt_token' };
            jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
            jest.spyOn(authService, 'login').mockResolvedValue(token);

            const result = await controller.login({ email: 'test@example.com', password: 'correct' });
            expect(result).toEqual(token);
        });
    });
});

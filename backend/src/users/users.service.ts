import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: Partial<User>): Promise<User> {
        const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordRaw = createUserDto.password || 'default123';
        const hashedPassword = await bcrypt.hash(passwordRaw, 10);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.usersRepository.save(user);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findOneByResetToken(token: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { resetPasswordToken: token } });
    }

    async save(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }
}

import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: Partial<User>): Promise<User>;
    findOneByEmail(email: string): Promise<User | null>;
    findOneByResetToken(token: string): Promise<User | null>;
    save(user: User): Promise<User>;
    findAll(): Promise<User[]>;
}

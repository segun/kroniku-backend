import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    create(user: Partial<User>): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    setRetrievalOptIn(userId: string, enabled: boolean): Promise<User | null>;
    deleteById(userId: string): Promise<void>;
}

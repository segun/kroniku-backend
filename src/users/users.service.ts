import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	create(user: Partial<User>): Promise<User> {
		const entity = this.usersRepository.create(user);
		return this.usersRepository.save(entity);
	}

	findById(id: string): Promise<User | null> {
		return this.usersRepository.findOne({ where: { id } });
	}

	findByEmail(email: string): Promise<User | null> {
		return this.usersRepository.findOne({
			where: { email: email.trim().toLowerCase() },
		});
	}

	async setRetrievalOptIn(userId: string, enabled: boolean): Promise<User | null> {
		await this.usersRepository.update({ id: userId }, { retrievalOptIn: enabled });
		return this.findById(userId);
	}

	deleteById(userId: string): Promise<void> {
		return this.usersRepository.delete({ id: userId }).then(() => undefined);
	}
}

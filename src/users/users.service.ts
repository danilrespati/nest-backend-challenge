import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findOneById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(user: Partial<User>): Promise<User> {
        if (!user.password) {
            throw new Error('Password is required');
        }
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        // Default role is user, can be overridden if provided
        return this.usersRepository.save(user);
    }
}

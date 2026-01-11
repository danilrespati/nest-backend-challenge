import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

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

    async follow(
        follower: string,
        followed: string,
    ): Promise<{ message: string }> {
        try {
            const followerUser = await this.usersRepository.findOne({where: {username: follower}})
            const followedUser = await this.usersRepository.findOne({where: {username: followed}})

            await this.usersRepository
                .createQueryBuilder()
                .update(User)
                .set({
                    follower: () => 'array_append(follower, :followerId)',
                })
                .setParameter("followerId", followerUser?.id)
                .where('id = :id', { id: followedUser?.id })
                .execute();

            await this.usersRepository
                .createQueryBuilder()
                .update(User)
                .set({
                    following: () => 'array_append(following, :followedId)',
                })
                .setParameter("followedId", followedUser?.id)
                .where('id = :id', { id: followerUser?.id })
                .execute();
            return { message: 'Success' };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Something went wrong');
        }
    }
}

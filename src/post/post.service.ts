import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) {}

    // TODO: image, video etc content
    async submitPost(userId: number, content: string): Promise<Post> {
        try {
            const post = this.postRepository.create({ userId, content });
            return this.postRepository.save(post);
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Something went wrong, please try again later',
            );
        }
    }

    async getPost(username : string): Promise<any[]> {
        // TODO: following post and user post logic
        const post = await this.postRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['user'],
            where: { user: {username} }
        });
        return post;
    }

    async searchPost(keyword : string): Promise<any[]> {
        const post = await this.postRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['user'],
            where: { content: ILike(`%${keyword}%`) }
        });
        return post;
    }
}

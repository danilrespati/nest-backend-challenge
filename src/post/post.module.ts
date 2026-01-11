import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UsersModule } from '../users/users.module';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Post]), UsersModule],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}

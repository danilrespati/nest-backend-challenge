import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PostService } from './post.service';

@Controller()
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) {}

    @UseGuards(ThrottlerGuard, JwtAuthGuard)
    @Post('post')
    async submitPost(
        @Request() req,
        @Body() body: { content: string },
    ) {
        let userId = req.user.userId;

        return this.postService.submitPost(userId, body.content);
    }

    @UseGuards(ThrottlerGuard, JwtAuthGuard)
    @Get('post')
    async getPost(
        @Request() req,
        @Body() body: { username: string },
    ) {
        
        return this.postService.getPost(body.username);
    }

    @UseGuards(ThrottlerGuard, JwtAuthGuard)
    @Get('search-post')
    async searchPost(
        @Request() req,
        @Body() body: { keyword: string },
    ) {
        
        return this.postService.searchPost(body.keyword);
    }
}

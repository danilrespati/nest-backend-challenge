import { Controller, Get, Post, Body, UseGuards, Request, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller()
export class ScoresController {
    constructor(
        private readonly scoresService: ScoresService,
        private readonly usersService: UsersService,
    ) { }

    @UseGuards(ThrottlerGuard, JwtAuthGuard)
    @Post('scores')
    async submitScore(@Request() req, @Body() body: { score: number, name?: string }) {
        let userId = req.user.userId;

        if (req.user.role === UserRole.ADMIN && body.name) {
            const targetUser = await this.usersService.findOne(body.name);
            if (!targetUser) {
                throw new NotFoundException(`User '${body.name}' not found`);
            }
            userId = targetUser.id;
        } else if (body.name && body.name !== req.user.username) {
            // Enforce requirement: "Users should only be able to submit scores for themselves"
            // If they try to submit for someone else (body.name != token.username), we deny it.
            // Alternatively, we could just ignore body.name and use req.user.userId (which is what we do if body.name is missing).
            // But if they EXPLICITLY ask for another user, we should probably error or default to self (let's error for clarity).
            throw new ForbiddenException("You can only submit scores for yourself");
        }

        return this.scoresService.submitScore(userId, body.score);
    }

    @Get('leaderboard')
    async getLeaderboard() {
        return this.scoresService.getLeaderboard();
    }
}

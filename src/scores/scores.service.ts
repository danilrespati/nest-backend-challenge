import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './score.entity';

@Injectable()
export class ScoresService {
    constructor(
        @InjectRepository(Score)
        private scoresRepository: Repository<Score>,
    ) {}

    async submitScore(userId: number, scoreValue: number): Promise<Score> {
        try {
            await this.scoresRepository.delete({userId})
            const score = this.scoresRepository.create({ userId, score: scoreValue})
            return this.scoresRepository.save(score)
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException("Something went wrong, please try again later");
        }
    }

    async getLeaderboard(): Promise<any[]> {
        const scores = await this.scoresRepository.find({
            order: { score: 'DESC' },
            take: 10,
            relations: ['user'],
        });
        return scores.map((s) => ({
            name: s.user.username,
            score: s.score,
        }));
    }
}

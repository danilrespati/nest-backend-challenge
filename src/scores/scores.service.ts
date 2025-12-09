import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './score.entity';

@Injectable()
export class ScoresService {
    constructor(
        @InjectRepository(Score)
        private scoresRepository: Repository<Score>,
    ) { }

    async submitScore(userId: number, scoreValue: number): Promise<Score> {
        const score = this.scoresRepository.create({ userId, score: scoreValue });
        return this.scoresRepository.save(score);
    }

    async getLeaderboard(): Promise<any[]> {
        const scores = await this.scoresRepository.find({
            order: { score: 'DESC' },
            take: 10,
            relations: ['user'],
        });
        return scores.map(s => ({
            name: s.user.username,
            score: s.score,
        }));
    }
}

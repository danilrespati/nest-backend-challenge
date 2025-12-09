import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { Score } from './score.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Score]),
    UsersModule
  ],
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule { }

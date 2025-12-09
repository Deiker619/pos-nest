import { Module } from '@nestjs/common';
import { LogPosService } from './log-pos.service';
import { LogPosController } from './log-pos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiPosLogger } from './entities/apiPosLogger.entity';

@Module({
  controllers: [LogPosController],
  providers: [LogPosService],
  imports: [TypeOrmModule.forFeature([ApiPosLogger])],
})
export class LogPosModule {}

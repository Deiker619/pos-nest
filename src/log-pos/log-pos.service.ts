import { Injectable } from '@nestjs/common';
import { CreateLogPoDto } from './dto/create-log-po.dto';
import { UpdateLogPoDto } from './dto/update-log-po.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiPosLogger } from './entities/apiPosLogger.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogPosService {
  constructor(
    @InjectRepository(ApiPosLogger)
    private readonly apiPosLoggerRepository: Repository<ApiPosLogger>,
  ) {}

  findAll() {
    return `This action returns all logPos`;
  }
}

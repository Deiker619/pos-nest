import { Controller, Get, Param } from '@nestjs/common';
import { LogPosService } from './log-pos.service';

@Controller('logpos')
export class LogPosController {
  constructor(private readonly logPosService: LogPosService) {}

  @Get()
  findAll() {
    return this.logPosService.findAll();
  }
}

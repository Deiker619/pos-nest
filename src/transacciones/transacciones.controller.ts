import { Controller, Get, Param, Query } from '@nestjs/common';
import { TransaccionesService } from './transacciones.service';

@Controller('transacciones')
export class TransaccionesController {
  constructor(private readonly transaccionesService: TransaccionesService) {}

  @Get()
  findAll(@Query() query) {
    return this.transaccionesService.findAll(query);
  }

}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { TransaccionesService } from './transacciones.service';
import { KpisService } from './kpis/kpis.service';

@Controller('transacciones')
export class TransaccionesController {
  constructor(
    private readonly transaccionesService: TransaccionesService,
    private readonly transaccionesKpis: KpisService,
  ) {}

  /*
   * TRANSACCIONES De LOS PUNTOS
   */
  @Get()
  findAll(@Query() query) {
    return this.transaccionesService.findAll(query);
  }

  /*
   * KPIS DE LAS TRANSACCIONES
   */
  @Get('/kpis')
  async countRemesa(@Query() query) {
    console.log('kpis', query.type);
    if (query.type == 'pago_movil')
      return this.transaccionesKpis.getKpisPagoMovil(query);
    if (query.type == 'diferido')
      return this.transaccionesKpis.getKpisPagoDiferido(query);
  }

  /*
   * ULTIMA TRANSACCION
   */
  @Get('/lastTransaccion')
  async lastTransaccion(@Query() query) {
    return { message: 'Hora y fecha de la ultima transaccion' };
  }
}

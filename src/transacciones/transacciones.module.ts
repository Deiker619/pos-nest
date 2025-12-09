import { Module } from '@nestjs/common';
import { TransaccionesService } from './transacciones.service';
import { TransaccionesController } from './transacciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiBinancePagos } from './entities/apiBinancePos.entity';
import { ApiPosLogger } from '../log-pos/entities/apiPosLogger.entity';
import { CrixtoPuntoHomologacion } from './entities/crixtoPuntoHomologacion.entity';
import { PosConfiguration } from './entities/posConfiguration.entity';
import { KpisService } from './kpis/kpis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApiBinancePagos]),
    TypeOrmModule.forFeature([CrixtoPuntoHomologacion]),
    TypeOrmModule.forFeature([PosConfiguration]),
  ],
  controllers: [TransaccionesController],
  providers: [TransaccionesService, KpisService],
})
export class TransaccionesModule {}

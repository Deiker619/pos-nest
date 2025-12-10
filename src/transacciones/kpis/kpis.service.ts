import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBinancePagos } from '../entities/apiBinancePos.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KpisService {
  constructor(
    @InjectRepository(ApiBinancePagos)
    private readonly apiBinancePagoRepo: Repository<ApiBinancePagos>,
  ) {}
  getKpisPagoMovil = async (query: any = {}) => {
    const { summarType = 'general', fecha_inicio, fecha_fin, tipoPago } = query;
    const qb = this.apiBinancePagoRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.punto', 'punto') // mantiene la relación viva
      .select([
        'p.id',
        'p.txnid',
        'p.tipo',
        'p.serial',
        'p.descripcion',
        'p.coin',
        'p.monto',
        'p.monto_pago',
        'p.comision',
        'p.tasa_bs_usd',
        'p.monto_recibido',
        'p.coin_recibido',
        'p.ref_bank',
        'p.montofiat',
        'p.comision_binancepay',
        'p.fecha',
        'punto.nombreComercial',
        'punto.banco',
        'punto.telefono',
        'punto.monedaRecibir',
      ])
      .where('p.descripcion LIKE :desc', { desc: 'PUNTO DE VENTA%' })
      .andWhere('punto.monedaRecibir = :moneda', { moneda: 'Bs' });

    if (fecha_inicio && fecha_fin) {
      console.log('filtrando');
      const inicio = new Date(`${fecha_inicio}:00Z`);
      const fin = new Date(`${fecha_fin}:00Z`);
      qb.andWhere('p.fecha BETWEEN :inicio AND :fin', { inicio, fin });
    }

    const [data, total] = await qb.getManyAndCount();

    return this.getSummary(summarType, data);
  };
  getKpisPagoDiferido = async (query: any = {}) => {
    const { summarType = 'general', fecha_inicio, fecha_fin } = query;
    const qb = this.apiBinancePagoRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.punto', 'punto') // mantiene la relación viva
      .select([
        'p.id',
        'p.txnid',
        'p.tipo',
        'p.serial',
        'p.descripcion',
        'p.coin',
        'p.monto',
        'p.monto_pago',
        'p.comision',
        'p.tasa_bs_usd',
        'p.monto_recibido',
        'p.coin_recibido',
        'p.ref_bank',
        'p.montofiat',
        'p.comision_binancepay',
        'p.fecha',
        'punto.nombreComercial',
        'punto.banco',
        'punto.telefono',
        'punto.monedaRecibir',
      ])
      .where('p.descripcion LIKE :desc', { desc: 'PUNTO DE VENTA%' })
      .andWhere('punto.monedaRecibir = :moneda', { moneda: 'USDT' });

    if (fecha_inicio && fecha_fin) {
      console.log('filtrando');
      const inicio = new Date(`${fecha_inicio}:00Z`);
      const fin = new Date(`${fecha_fin}:00Z`);
      qb.andWhere('p.fecha BETWEEN :inicio AND :fin', { inicio, fin });
    }

    const [data, total] = await qb.getManyAndCount();

    return this.getSummary(summarType, data);
  };

  getSummary = async (
    type: 'serial' | 'nombre' | 'general' = 'general',
    data: any[],
  ) => {
    switch (type) {
      case 'serial':
        return this.getSummaryBySerial(data);

      case 'nombre':
        return this.getSummaryByNombreComercial(data);

      case 'general':
        return this.getSummaryGeneral(data);

      default:
        throw new Error(`Tipo de agrupación no soportado: ${type}`);
    }
  };

  getSummaryBySerial = (data: any[]) => {
    console.log('serial');
    const accumulated = data.reduce((acc, item) => {
      const serialPunto = item?.serial || 'Sin Serial';
      const nombrePunto = item.punto?.nombreComercial || 'Sin nombre';

      if (!acc[serialPunto]) {
        acc[serialPunto] = {
          totalTransacciones: 0,
          totalMonto: 0,
          totalMontoRecibido: 0,
          totalFiat: 0,
          _nombresComerciales: new Set<string>(),
        };
      }

      acc[serialPunto].totalTransacciones += 1;
      acc[serialPunto].totalMonto += Number(item.monto_pago) || 0;
      acc[serialPunto].totalMontoRecibido += Number(item.monto_recibido) || 0;
      acc[serialPunto].totalFiat += Number(item.montofiat) || 0;
      acc[serialPunto]._nombresComerciales.add(nombrePunto);

      return acc;
    }, {});

    // Post-procesar para convertir Set a array y agregar cantidad
    const result = {};
    for (const [key, value] of Object.entries(accumulated)) {
      const { _nombresComerciales, ...rest } = value as any;
      result[key] = {
        ...rest,
        cantidadNombresComerciales: _nombresComerciales.size,
        nombresComerciales: Array.from(_nombresComerciales),
      };
    }

    return result;
  };

  getSummaryByNombreComercial = (data: any[]) => {
    const accumulated = data.reduce((acc, item) => {
      const nombrePunto = item.punto?.nombreComercial || 'Sin nombre';
      const serialPunto = item?.serial || 'Sin Serial';

      if (!acc[nombrePunto]) {
        acc[nombrePunto] = {
          nombreComercio: nombrePunto,
          totalTransacciones: 0,
          totalMonto: 0,
          totalMontoRecibido: 0,
          totalFiat: 0,
          _seriales: new Set<string>(),
        };
      }

      acc[nombrePunto].totalTransacciones += 1;
      acc[nombrePunto].totalMonto += Number(item.monto_pago) || 0;
      acc[nombrePunto].totalMontoRecibido += Number(item.monto_recibido) || 0;
      acc[nombrePunto].totalFiat += Number(item.montofiat) || 0;
      acc[nombrePunto]._seriales.add(serialPunto);

      return acc;
    }, {});

    // Post-procesar para convertir Set a array y agregar cantidad
    const result = {};
    for (const [key, value] of Object.entries(accumulated)) {
      const { _seriales, ...rest } = value as any;
      result[key] = {
        ...rest,
        cantidadPuntos: _seriales.size,
        puntos: Array.from(_seriales),
      };
    }

    return result;
  };

  getSummaryGeneral = (data: any[]) => {
    const summary = data.reduce(
      (acc, item) => {
        const serial = item?.serial || 'Sin Serial';
        const tasa = Number(item.tasa_bs_usd) || 0;

        // Totales generales
        acc.totalTransacciones += 1;
        acc.binanceComision += Number(item.comision_binancepay) || 0;
        acc.totalMonto += Number(item.monto_pago) || 0;
        acc.totalMontoRecibido += Number(item.monto_recibido) || 0;
        acc.totalFiat += Number(item.montofiat) || 0;
        acc.comision += Number(item.comision) || 0;
        // Seriales únicos
        acc._seriales.add(serial);

        // Acumulación para tasa promedio
        if (tasa > 0) {
          acc.totalTasa += tasa;
          acc.cantTasas += 1;
        }

        return acc;
      },
      {
        totalTransacciones: 0,
        totalMonto: 0,
        binanceComision: 0,
        totalMontoRecibido: 0,
        totalFiat: 0,
        comision: 0,
        _seriales: new Set<string>(),

        totalTasa: 0, // suma de las tasas válidas
        cantTasas: 0, // cuántas tasas válidas hubo
      },
    );

    return {
      totalTransacciones: summary.totalTransacciones,
      totalMonto: summary.totalMonto,
      totalMontoRecibido: summary.totalMontoRecibido,
      totalFiat: summary.totalFiat,
      binanceComision: summary.binanceComision,
      comision: summary.comision,
      totalPuntosTransacciones: summary._seriales.size,

      tasaPromedio:
        summary.cantTasas > 0
          ? Number((summary.totalTasa / summary.cantTasas).toFixed(2))
          : 0,
    };
  };
}

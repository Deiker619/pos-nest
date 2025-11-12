import { Injectable } from '@nestjs/common';
import { ApiBinancePagos } from './entities/apiBinancePos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransaccionesService {
  constructor(
    @InjectRepository(ApiBinancePagos)
    private readonly apiBinancePagosRepo: Repository<ApiBinancePagos>,
  ) {}

  /*
   * Metodo principal, el que orquesta todos los tipos de transacciones
   */
  async findAll(query) {
    return await this.getTransaccionesAll(query);
  }

  async getTransaccionesAll(query: any = {}) {
    const {
      limit = 50,
      page = 1,
      fecha_inicio,
      fecha_fin,
      busqueda,
      orden,
    } = query;

    const skip = (page - 1) * limit;

    const qb = this.apiBinancePagosRepo
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
        'p.tasa_bs_usd',
        'p.monto_recibido',
        'p.coin_recibido',
        'p.usuario_receptor',
        'p.ref_bank',
        'p.montofiat',
        'p.comision_binancepay',
        'p.fecha',
        'punto.nombreComercial', // solo los campos que te interesan
        'punto.banco',
        'punto.telefono',
      ])
      .where('p.descripcion LIKE :desc', { desc: 'PUNTO DE VENTA%' })
      .orderBy('p.id', 'ASC')
      .take(limit)
      .skip(skip)
      .cache(
        `pagos_pos_${page}_${fecha_inicio}_${fecha_fin}_${busqueda}`,
        15000,
      );

    // 🔹 Filtro por fecha
    if (fecha_inicio && fecha_fin) {
      const inicio = new Date(`${fecha_inicio}:00Z`);
      const fin = new Date(`${fecha_fin}:00Z`);
      qb.andWhere('p.fecha BETWEEN :inicio AND :fin', { inicio, fin });
    }

    // 🔹 Filtro de búsqueda
    if (busqueda && busqueda.trim() !== '') {
      const likeValue = `%${busqueda}%`;
      qb.andWhere(
        `(
        CAST(p.id AS TEXT) ILIKE :likeValue OR
        p.txnid ILIKE :likeValue OR
        p.serial ILIKE :likeValue OR
        p.descripcion ILIKE :likeValue OR
        p.usuario_receptor ILIKE :likeValue OR
        p.ref_bank ILIKE :likeValue OR
        punto.nombre_comercial ILIKE :likeValue OR
        punto.banco ILIKE :likeValue
      )`,
        { likeValue },
      );
    }

    const [data, total] = await qb.getManyAndCount();
    return {
      total,
      page: +page,
      limit: +limit,
      data,
    };
  }
}

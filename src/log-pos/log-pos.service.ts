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

  /**
   * Obtiene todos los logs con paginación, filtros y búsqueda
   */
  async findAll(query: any = {}) {
    console.log(query);
    const {
      limit = 50,
      page = 1,
      fecha_inicio,
      fecha_fin,
      busqueda,
      tipo,
      serial,
      generado,
    } = query;

    const skip = (page - 1) * limit;

    const qb = this.apiPosLoggerRepository
      .createQueryBuilder('log')
      .select([
        'log.id',
        'log.serial',
        'log.tipo',
        'log.solicitud',
        'log.respuesta',
        'log.fechaEjecucion',
        'log.generado',
      ])
      .orderBy('log.id', 'DESC')
      .take(limit)
      .skip(skip)
      .cache(
        `logs_pos_${page}_${fecha_inicio}_${fecha_fin}_${busqueda}_${tipo}_${serial}`,
        15000,
      );

    // 🔹 Filtro por fecha
    if (fecha_inicio && fecha_fin) {
      const inicio = new Date(`${fecha_inicio}:00Z`);
      const fin = new Date(`${fecha_fin}:00Z`);
      qb.andWhere('log.fechaEjecucion BETWEEN :inicio AND :fin', {
        inicio,
        fin,
      });
    }

    // 🔹 Filtro de búsqueda
    if (busqueda) {
      console.log(busqueda);
      const likeValue = `%${busqueda.trim()}%`;
      qb.andWhere(
        `(
        CAST(log.id AS TEXT) ILIKE :likeValue OR
        log.serial ILIKE :likeValue OR
        log.tipo ILIKE :likeValue OR
        log.solicitud ILIKE :likeValue OR
        log.respuesta ILIKE :likeValue
      )`,
        { likeValue },
      );
    }

    // 🔹 Filtro por tipo
    if (tipo) {
      qb.andWhere('log.tipo = :tipo', { tipo });
    }

    // 🔹 Filtro por serial
    if (serial) {
      qb.andWhere('log.serial = :serial', { serial });
    }

    // 🔹 Filtro por generado
    if (generado !== undefined && generado !== null && generado !== '') {
      const isGenerado = generado === 'true' || generado === true;
      qb.andWhere('log.generado = :generado', { generado: isGenerado });
    }

    const [data, total] = await qb.getManyAndCount();
    console.log(total);

    return {
      total,
      page: +page,
      limit: +limit,
      data,
    };
  }

  /**
   * Obtiene un log por ID
   */
  async findOne(id: number) {
    return await this.apiPosLoggerRepository.findOne({
      where: { id },
    });
  }

  /**
   * Crea un nuevo log
   */
  async create(createLogPoDto: CreateLogPoDto) {
    const newLog = this.apiPosLoggerRepository.create(createLogPoDto);
    return await this.apiPosLoggerRepository.save(newLog);
  }

  /**
   * Actualiza un log existente
   */
  async update(id: number, updateLogPoDto: UpdateLogPoDto) {
    await this.apiPosLoggerRepository.update(id, updateLogPoDto);
    return await this.findOne(id);
  }

  /**
   * Elimina un log
   */
  async remove(id: number) {
    const log = await this.findOne(id);
    if (!log) {
      throw new Error(`Log con ID ${id} no encontrado`);
    }
    await this.apiPosLoggerRepository.delete(id);
    return { message: `Log con ID ${id} eliminado exitosamente` };
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LogPosService } from './log-pos.service';
import { CreateLogPoDto } from './dto/create-log-po.dto';
import { UpdateLogPoDto } from './dto/update-log-po.dto';

@Controller('logpos')
export class LogPosController {
  constructor(private readonly logPosService: LogPosService) {}

  /**
   * Obtiene todos los logs con paginación y filtros
   * Query params:
   * - limit: número de registros por página (default: 50)
   * - page: número de página (default: 1)
   * - fecha_inicio: fecha de inicio para filtrar
   * - fecha_fin: fecha de fin para filtrar
   * - busqueda: término de búsqueda general
   * - tipo: filtrar por tipo de log
   * - serial: filtrar por serial del POS
   * - generado: filtrar por estado generado (true/false)
   */
  @Get()
  findAll(@Query() query) {
    return this.logPosService.findAll(query);
  }

  /**
   * Obtiene un log por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logPosService.findOne(+id);
  }

  /**
   * Crea un nuevo log
   */
  @Post()
  create(@Body() createLogPoDto: CreateLogPoDto) {
    return this.logPosService.create(createLogPoDto);
  }

  /**
   * Actualiza un log existente
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogPoDto: UpdateLogPoDto) {
    return this.logPosService.update(+id, updateLogPoDto);
  }

  /**
   * Elimina un log
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logPosService.remove(+id);
  }
}

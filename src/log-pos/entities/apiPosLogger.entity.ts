import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'public', name: 'api_pos_logger' })
export class ApiPosLogger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  serial: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string;

  @Column({ type: 'text', nullable: true })
  solicitud: string;

  @Column({ type: 'text', nullable: true })
  respuesta: string;

  @Column({ name: 'fecha_ejecucion', type: 'timestamp', nullable: true })
  fechaEjecucion: Date;

  @Column({ type: 'boolean', default: false })
  generado: boolean;
}

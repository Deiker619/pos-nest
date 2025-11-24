import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiBinancePagos } from './apiBinancePos.entity';
import { ModeloTransformer } from 'src/transformers/modelo.transformer';

@Entity({ schema: 'public', name: 'crixto_punto_homologacion' })
export class CrixtoPuntoHomologacion {
  @PrimaryGeneratedColumn({ name: 'id_err', type: 'bigint' })
  idErr: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  rif: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  serial: string;

  @Column({
    name: 'nombre_comercial',
    type: 'varchar',
    nullable: true,
  })
  nombreComercial: string;

  @Column({ type: 'int', nullable: true, default: 1,  transformer: ModeloTransformer })
  modelo: number;

  @Column({ type: 'varchar', length: 15, nullable: true})
  cedula: string;

  @Column({ name: 'cod_banco', type: 'varchar', length: 10, nullable: true })
  codBanco: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  banco: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({
    name: 'moneda_recibir',
    type: 'varchar',
    length: 10,
    default: 'Bs',
  })
  monedaRecibir: string;

  @Column({
    name: 'serial_fisico',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  serialFisico: string;

  @Column({ name: 'n_terminal', type: 'varchar', length: 20, nullable: true })
  nTerminal: string;

  @Column({ name: 'emp_asig', type: 'varchar', length: 255, nullable: true })
  empAsig: string;

  @Column({
    name: 'cuantas_concentradoras',
    type: 'int',
    nullable: true,
    default: 0,
  })
  cuantasConcentradoras: number;

  @Column({
    name: 'usuario_destino',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  usuarioDestino: string;

  @Column({ type: 'int', nullable: true })
  id: number;

  @OneToMany(() => ApiBinancePagos, (pago) => pago.punto)
  pagos: ApiBinancePagos[];
}

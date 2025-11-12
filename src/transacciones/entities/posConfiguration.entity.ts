import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'pos_configuration' })
export class PosConfiguration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cliente: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cuenta_pote: string;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  comision_cliente: number;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  comision_comercio: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo_pago: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cuenta_comision: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cuenta_comision_comercio: string;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  comision_bs: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  submerchantid: string;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  comision_cliente_binance: number;
}

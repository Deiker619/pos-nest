import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CrixtoPuntoHomologacion } from './crixtoPuntoHomologacion.entity';

@Entity({ schema: 'sch_crypto_pago', name: 'api_binance_pagos' })
export class ApiBinancePagos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  txnid: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  clienttranid: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  key_user: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  monto: number;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  comision: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  coin: string;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  monto_pago: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  usuario_receptor: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token_par: string;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  tasa_bs_usd: number;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  paridad: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  is_facturado: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  serial: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ref_m: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email_origen: string;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  monto_recibido: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  coin_recibido: string;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  comision_recibir: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ref_bank: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre_cliente: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  identificacion_cliente: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  pagado: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  red_pago: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  plataforma: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tel_pm: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  id_pm: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bank_pm: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  txnid_bin: string;

  @Column({ type: 'boolean', nullable: true })
  is_process_tranred: boolean;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  montofiat: number;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  comision_binancepay: number;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  pagado_bs: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  order_id: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  payment_attempts: number;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  comision_comercio: number;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  monto_comercio: number;

  @Column({ type: 'numeric', precision: 18, scale: 8, nullable: true })
  taza_venta: number;

  @ManyToOne(() => CrixtoPuntoHomologacion, (punto) => punto.pagos)
  @JoinColumn({ name: 'serial', referencedColumnName: 'serial' })
  punto: CrixtoPuntoHomologacion;
}

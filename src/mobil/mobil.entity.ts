import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Mobil extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({type : 'varchar'})
  nama: string;

  @Column({ type: 'varchar' })
  merekMobil: string;

  @Column({ type: 'varchar' })
  tipeMobil: string;

  @Column({ type: 'integer' })
  harga: number;

  @Column({ type: 'integer' })
  tahun: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

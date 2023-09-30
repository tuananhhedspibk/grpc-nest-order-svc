import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  public price!: number;

  @Column({ type: 'integer' })
  public product_id!: number;

  @Column({ type: 'integer' })
  public user_id!: number;
}

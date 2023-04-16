import { Column, CreateDateColumn } from 'typeorm';

export abstract class AuditEntity {
  @CreateDateColumn({
    nullable: false,
    update: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'int', nullable: true })
  createdUser: number;

  @Column({ type: 'int', nullable: true })
  updatedUser: number;

  @Column({ type: 'int', nullable: true })
  deletedUser: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;
}

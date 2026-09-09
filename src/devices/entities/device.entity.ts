import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'devices' })
@Unique(['userId', 'clientDeviceId'])
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'varchar', length: 160 })
  clientDeviceId!: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  platform!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  appVersion!: string | null;

  @Column({ type: 'text', nullable: true })
  publicKey!: string | null;

  @Column({ type: 'datetime', nullable: true })
  lastSeenAt!: Date | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from '../../devices/entities/device.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'sync_conflicts' })
export class SyncConflict {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Index()
  @Column({ type: 'varchar', length: 80 })
  eventId!: string;

  @Column({ type: 'uuid', nullable: true })
  incomingDeviceId!: string | null;

  @ManyToOne(() => Device, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'incomingDeviceId' })
  incomingDevice!: Device | null;

  @Column({ type: 'int' })
  incomingVersion!: number;

  @Column({ type: 'int' })
  serverVersion!: number;

  @Column({ type: 'varchar', length: 40 })
  strategy!: 'ignored_stale' | 'same_version_conflict';

  @Column({ type: 'varchar', length: 128, nullable: true })
  incomingPayloadHash!: string | null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  serverPayloadHash!: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}

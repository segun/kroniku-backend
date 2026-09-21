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
import { Device } from '../../devices/entities/device.entity';
import { User } from '../../users/entities/user.entity';
import type { SyncEventContextDto } from '../../sync/dto/push-sync.dto';

@Entity({ name: 'sync_events' })
@Unique(['userId', 'eventId'])
export class SyncEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  deviceId!: string | null;

  @ManyToOne(() => Device, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'deviceId' })
  device!: Device | null;

  @Column({ type: 'varchar', length: 80 })
  eventId!: string;

  @Column({ type: 'int', default: 1 })
  version!: number;

  @Column({ type: 'datetime', nullable: true })
  occurredAt!: Date | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  source!: string | null;

  @Column({ type: 'text', nullable: true })
  title!: string | null;

  @Column({ type: 'text', nullable: true })
  detail!: string | null;

  @Column({ type: 'text', nullable: true })
  searchText!: string | null;

  @Column({ type: 'json', nullable: true })
  contextData!: SyncEventContextDto | null;

  @Column({ type: 'text' })
  encryptedPayload!: string;

  @Column({ type: 'varchar', length: 128 })
  payloadHash!: string;

  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}

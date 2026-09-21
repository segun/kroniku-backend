import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'user_preferences' })
export class UserPreferences {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'int', default: 360 })
  morningStartMinutes!: number;

  @Column({ type: 'int', default: 720 })
  afternoonStartMinutes!: number;

  @Column({ type: 'int', default: 960 })
  earlyEveningStartMinutes!: number;

  @Column({ type: 'int', default: 1260 })
  nightStartMinutes!: number;

  @Column({ type: 'varchar', length: 120, nullable: true })
  timezoneIdentifier!: string | null;

  @Column({ type: 'int', default: 1 })
  schemaVersion!: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type AuthProvider = 'google' | 'apple';

@Entity({ name: 'auth_identities' })
@Unique(['provider', 'providerSubject'])
export class AuthIdentity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'varchar', length: 20 })
  provider!: AuthProvider;

  @Column({ type: 'varchar', length: 255 })
  providerSubject!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}

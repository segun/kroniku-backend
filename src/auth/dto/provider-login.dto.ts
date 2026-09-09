import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import type { AuthProvider } from '../entities/auth-identity.entity';

export class ProviderLoginDto {
  @IsIn(['google', 'apple'])
  provider!: AuthProvider;

  @IsString()
  idToken!: string;

  @IsString()
  @MaxLength(160)
  clientDeviceId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  platform?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  appVersion?: string;

  @IsOptional()
  @IsString()
  publicKey?: string;
}

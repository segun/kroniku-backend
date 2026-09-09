import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RegisterDeviceDto {
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

import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PushSyncEventDto {
  @IsString()
  @MaxLength(80)
  eventId!: string;

  @IsInt()
  @Min(1)
  version!: number;

  @IsOptional()
  @IsDateString()
  occurredAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  source?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @IsString()
  searchText?: string;

  @IsString()
  encryptedPayload!: string;

  @IsString()
  @MaxLength(128)
  payloadHash!: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

export class PushSyncDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PushSyncEventDto)
  events!: PushSyncEventDto[];
}

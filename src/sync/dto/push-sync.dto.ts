import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SyncPlaceDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;
}

export class SyncWeatherDto {
  @IsDateString()
  observedAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  condition?: string;

  @IsOptional()
  @IsNumber()
  temperatureC?: number;
}

export class SyncPhotoReferenceDto {
  @IsString()
  @MaxLength(255)
  assetIdentifier!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  filename?: string;

  @IsDateString()
  addedAt!: string;
}

export class SyncEventContextDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => SyncPlaceDto)
  place?: SyncPlaceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SyncWeatherDto)
  weather?: SyncWeatherDto;

  @IsOptional()
  @IsIn(['driving', 'walking', 'running', 'cycling', 'stationary'])
  motion?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  timeSemantics?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncPhotoReferenceDto)
  photoReferences?: SyncPhotoReferenceDto[];

  // Free-form moment: zero or more linked contact names/identifiers.
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(160, { each: true })
  contacts?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  userNote?: string;

  // Free-form moment: optional end of a start/end time range.
  @IsOptional()
  @IsDateString()
  endedAt?: string;
}

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
  title?: string;

  @IsOptional()
  @IsString()
  detail?: string;

  @IsOptional()
  @IsString()
  searchText?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SyncEventContextDto)
  contextData?: SyncEventContextDto;

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

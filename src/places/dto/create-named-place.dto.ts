import { IsLatitude, IsLongitude, IsString, MaxLength } from 'class-validator';

export class CreateNamedPlaceDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;
}

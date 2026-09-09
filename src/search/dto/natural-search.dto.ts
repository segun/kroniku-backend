import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class NaturalSearchDto {
  @IsString()
  @MaxLength(240)
  query!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

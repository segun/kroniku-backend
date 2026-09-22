import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class KeywordSearchDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  query?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  source?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class KeywordSearchDto {
  @IsString()
  @MaxLength(200)
  query!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

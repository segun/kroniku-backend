import { IsDateString, IsOptional } from 'class-validator';

export class PullSyncDto {
  @IsOptional()
  @IsDateString()
  since?: string;
}

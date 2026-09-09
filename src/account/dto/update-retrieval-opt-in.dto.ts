import { IsBoolean } from 'class-validator';

export class UpdateRetrievalOptInDto {
  @IsBoolean()
  enabled!: boolean;
}

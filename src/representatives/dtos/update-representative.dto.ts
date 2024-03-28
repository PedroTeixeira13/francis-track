import { IsString } from 'class-validator';

export class UpdateRepresentativeDto {
  @IsString()
  name: string;

  @IsString()
  company: string;
}

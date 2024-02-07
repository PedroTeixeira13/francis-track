import { IsString } from 'class-validator';

export class CreateRepresentativeDto {
  @IsString()
  name: string;

  @IsString()
  company: string;
}

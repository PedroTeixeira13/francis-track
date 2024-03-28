import { CustomerResponseDto } from 'src/customers/dtos/customer-response.dto';
import { Representative } from '../representative.entity';
import { Expose, Type } from 'class-transformer';

export class RepresentativeResponseDto {
  @Expose()
  name: string;

  @Expose()
  @Type(() => CustomerResponseDto)
  company: CustomerResponseDto;
}

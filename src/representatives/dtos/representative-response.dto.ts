import { CustomerResponseDto } from 'src/customers/dtos/customer-response.dto';
import { Representative } from '../representative.entity';

export class RepresentativeResponseDto {
  name: string;
  company: CustomerResponseDto;

  constructor(rep: Representative) {
    this.name = rep.name;
    this.company = rep.company;
  }
}

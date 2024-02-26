import { Meeting } from 'src/meetings/meeting.entity';
import { RepresentativeResponseDto } from 'src/representatives/dtos/representative-response.dto';
import { Customer } from '../customer.entity';

export class CustomerResponseDto {
  company: string;
  representatives: RepresentativeResponseDto[];
  meetings: Meeting[];

  constructor(customer: Customer) {
    this.company = customer.company;
    this.representatives = customer.representatives
    this.meetings = customer.meetings;
  }
}

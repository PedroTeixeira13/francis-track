import { Expose, Type } from 'class-transformer';
import { MeetingResponseDto } from 'src/meetings/dtos/meeting-response.dto';
import { RepresentativeResponseDto } from 'src/representatives/dtos/representative-response.dto';

export class CustomerResponseDto {
  @Expose()
  company: string;

  @Expose()
  @Type(() => RepresentativeResponseDto)
  representatives: RepresentativeResponseDto[];

  @Expose()
  @Type(() => MeetingResponseDto)
  meetings: MeetingResponseDto[];
}

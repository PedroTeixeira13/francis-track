import { Controller } from '@nestjs/common';
import { UsersMeetingsService } from './users-meetings.service';

@Controller('users-meetings')
export class UsersMeetingsController {
  constructor(private readonly usersMeetingsService: UsersMeetingsService) {}
}

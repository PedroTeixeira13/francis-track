import { Expose } from 'class-transformer';
import { User } from '../user.entity';

export class UserResponseDto {
  @Expose()
  name: string;

  @Expose()
  username: string;

  @Expose()
  role: string;
}

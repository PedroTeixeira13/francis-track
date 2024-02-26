import { User } from '../user.entity';

export class UserResponseDto {
  name: string;
  username: string;
  role: string;

  constructor(user: User) {
    this.name = user.name;
    this.username = user.username;
    this.role = user.role;
  }
}

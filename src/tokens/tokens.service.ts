import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokensService {
  constructor(@InjectRepository(Token) private repo: Repository<Token>, private usersService: UsersService) {}

  async create(token: string, id: string) {
    
    const user = await this.usersService.findById(id)
    
    const newToken = new Token()
    newToken.token = token
    newToken.user = user

    return this.repo.save(newToken);
  }
}

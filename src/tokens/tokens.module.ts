import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Token } from "./token.entity";
import { TokensService } from "./tokens.service";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Token]), UsersModule],
  providers: [TokensService],
  exports: [TokensService]
})
export class TokensModule {}
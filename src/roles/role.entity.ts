import { User } from 'src/users/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from './enums/role.enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: RoleEnum})
  name: RoleEnum;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}

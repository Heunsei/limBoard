import { IsEmail, IsOptional, IsEnum } from 'class-validator';
import { TeamRole } from '../entities/teamMember.entity';

export class AddUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(TeamRole)
  role?: TeamRole;
}
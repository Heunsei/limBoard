import { SetMetadata } from '@nestjs/common';
import { TeamRole } from '../../team/entities/teamMember.entity';

export const ROLE_KEY = 'role';
export const Role = (role: TeamRole) => SetMetadata(ROLE_KEY, role);
import { SetMetadata } from '@nestjs/common';
import { projectRole } from '../../project/entities/projectMember.entity';

export const PROJECT_ROLE_KEY = 'project_role';
export const ProjectRole = (role: projectRole) => SetMetadata(PROJECT_ROLE_KEY, role);
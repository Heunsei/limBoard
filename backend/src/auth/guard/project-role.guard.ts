import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PROJECT_ROLE_KEY } from '../decorator/project-role.decorator';
import { projectRole } from '../../project/entities/projectMember.entity';
import { ProjectMemberEntity } from '../../project/entities/projectMember.entity';

@Injectable()
export class ProjectRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(ProjectMemberEntity)
    private projectMemberRepository: Repository<ProjectMemberEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<projectRole>(PROJECT_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;
    const projectId = request.params?.id || request.params?.projectId;

    if (!userId || !projectId) {
      throw new ForbiddenException('User ID or Project ID not found');
    }

    const projectMember = await this.projectMemberRepository.findOne({
      where: {
        project: { id: projectId },
        user: { id: userId },
        role: requiredRole,
      },
    });

    if (!projectMember) {
      throw new ForbiddenException(`Only project ${requiredRole.toLowerCase()} can perform this action`);
    }

    return true;
  }
}
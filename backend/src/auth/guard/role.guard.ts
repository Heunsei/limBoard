import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLE_KEY } from '../decorator/role.decorator';
import { TeamMemberEntity, TeamRole, TEAM_ROLE_LEVELS, TEAM_ROLE_NAMES } from '../../team/entities/teamMember.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  // UUID 정규식 상수
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  // 에러 메시지 상수
  private static readonly ERROR_MESSAGES = {
    NO_AUTH_INFO: '인증 정보 또는 팀 ID가 없습니다.',
    INVALID_TEAM_ID: '유효하지 않은 팀 ID 형식입니다.',
    NO_TEAM_ACCESS: '이 팀에 접근할 권한이 없습니다.',
    INSUFFICIENT_ROLE: (requiredRole: TeamRole) => 
      `이 작업을 수행할 권한이 없습니다. ${TEAM_ROLE_NAMES[requiredRole]} 이상의 권한이 필요합니다.`
  } as const;

  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(TeamMemberEntity)
    private readonly teamMemberRepository: Repository<TeamMemberEntity>,
  ) {}

  // 역할 레벨 조회 (enum에서 가져오기)
  private getRoleLevel(role: TeamRole): number {
    return TEAM_ROLE_LEVELS[role] ?? 0;
  }

  // UUID 형식 검증
  private validateUUID(uuid: string): boolean {
    return RoleGuard.UUID_REGEX.test(uuid);
  }

  // 인증 정보 추출 및 검증
  private extractAuthInfo(request: any): { userId: string; teamId: string } {
    const userId = request.user?.sub;
    const teamId = request.params?.id;

    if (!userId || !teamId) {
      throw new ForbiddenException(RoleGuard.ERROR_MESSAGES.NO_AUTH_INFO);
    }

    if (!this.validateUUID(teamId)) {
      throw new BadRequestException(RoleGuard.ERROR_MESSAGES.INVALID_TEAM_ID);
    }

    return { userId, teamId };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 메타데이터에서 필요한 역할 확인
    const requiredRole = this.reflector.getAllAndOverride<TeamRole>(ROLE_KEY, [
      context.getHandler(),  // 메서드 레벨
      context.getClass(),    // 클래스 레벨
    ]);

    // Role 데코레이터가 없으면 통과
    if (!requiredRole) {
      return true;
    }

    // 2. 요청에서 인증 정보 추출 및 검증
    const request = context.switchToHttp().getRequest();
    const { userId, teamId } = this.extractAuthInfo(request);

    // 3. 팀 멤버십 조회 (성능 최적화: select 최소화)
    const membership = await this.teamMemberRepository.findOne({
      where: { 
        user: { id: userId }, 
        team: { id: teamId } 
      },
      select: ['role'], // 필요한 필드만 조회
    });

    if (!membership) {
      throw new ForbiddenException(RoleGuard.ERROR_MESSAGES.NO_TEAM_ACCESS);
    }

    // 4. 권한 레벨 비교
    const userRoleLevel = this.getRoleLevel(membership.role);
    const requiredRoleLevel = this.getRoleLevel(requiredRole);

    if (userRoleLevel < requiredRoleLevel) {
      throw new ForbiddenException(
        RoleGuard.ERROR_MESSAGES.INSUFFICIENT_ROLE(requiredRole)
      );
    }

    return true;
  }
}
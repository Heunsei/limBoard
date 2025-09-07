import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamEntity } from './entities/team.entity';
import { TeamMemberEntity, TeamRole } from './entities/teamMember.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(TeamMemberEntity)
    private readonly teamMemberRepository: Repository<TeamMemberEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * 새 팀을 생성하고 생성자를 ADMIN으로 등록
   * @param createTeamDto - 팀 생성 정보
   * @param creatorUserId - 팀을 생성하는 사용자 ID
   * @returns 생성된 팀 정보 (멤버 정보 포함)
   */
  async create(createTeamDto: CreateTeamDto, creatorUserId: string) {
    const team = this.teamRepository.create({
      name: createTeamDto.name,
      description: createTeamDto.description,
    });

    const savedTeam = await this.teamRepository.save(team);

    const teamMember = this.teamMemberRepository.create({
      team: savedTeam,
      user: { id: creatorUserId } as UserEntity, // 사용자 ID만 참조
      role: TeamRole.admin, // 생성자는 자동으로 ADMIN 역할
    });

    await this.teamMemberRepository.save(teamMember);

    return await this.teamRepository.findOne({
      where: { id: savedTeam.id },
      relations: ['members', 'members.user'],
    });
  }

  /**
   * 사용자가 속한 모든 팀 조회
   * @param userId - 사용자 ID
   * @returns 사용자가 속한 팀 목록 (역할 정보 포함)
   */
  async findAll(userId: string) {
    const teamMembers = await this.teamMemberRepository.find({
      where: { user: { id: userId } },
      relations: ['team', 'team.members', 'team.members.user'],
    });

    return teamMembers.map(teamMember => ({
      ...teamMember.team,
      userRole: teamMember.role,
    }));
  }

  /**
   * 특정 팀 조회
   * @param teamId - 팀 ID
   * @param userId - 요청한 사용자 ID (팀 멤버 여부 확인용)
   * @returns 팀 정보 (멤버 정보 포함)
   */
  async findOne(teamId: string, userId: string) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['members', 'members.user'],
    });

    if (!team) {
      throw new NotFoundException('팀을 찾을 수 없습니다.');
    }

    // 사용자가 이 팀의 멤버인지 확인
    const userMembership = await this.getUserRoleInTeam(userId, teamId);
    if (!userMembership) {
      throw new ForbiddenException('이 팀에 접근할 권한이 없습니다.');
    }

    return {
      ...team,
      userRole: userMembership.role,
    };
  }

  /**
   * 이메일로 팀에 유저 추가 (MANAGER 이상 권한 필요)
   * @param teamId - 팀 ID
   * @param email - 추가할 유저의 이메일
   * @param role - 부여할 역할 (기본: MEMBER)
   * @returns 추가된 팀원 정보
   */
  async addUser(teamId: string, email: string, role: TeamRole = TeamRole.member) {
    // 팀 존재 확인
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('팀을 찾을 수 없습니다.');
    }

    // 유저 존재 확인
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('해당 이메일의 사용자를 찾을 수 없습니다.');
    }

    // 이미 팀 멤버인지 확인
    const existingMember = await this.teamMemberRepository.findOne({
      where: {
        team: { id: teamId },
        user: { id: user.id },
      },
    });

    if (existingMember) {
      throw new BadRequestException('이미 팀에 속한 사용자입니다.');
    }

    // 새 팀원 추가
    const newMember = this.teamMemberRepository.create({
      team: { id: teamId } as TeamEntity,
      user: { id: user.id } as UserEntity,
      role,
    });

    const savedMember = await this.teamMemberRepository.save(newMember);

    // 팀원 정보와 함께 반환
    return await this.teamMemberRepository.findOne({
      where: { id: savedMember.id },
      relations: ['user', 'team'],
    });
  }

  /**
   * 팀에서 유저 제거 (MANAGER 이상 권한 필요)
   * @param teamId - 팀 ID
   * @param userId - 제거할 유저의 ID
   * @returns 제거 성공 메시지
   */
  async removeUser(teamId: string, userId: string) {
    // 팀 존재 확인
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('팀을 찾을 수 없습니다.');
    }

    // 팀 멤버 존재 확인
    const teamMember = await this.teamMemberRepository.findOne({
      where: {
        team: { id: teamId },
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!teamMember) {
      throw new NotFoundException('해당 유저가 팀에 속해 있지 않습니다.');
    }

    // ADMIN 유저는 제거할 수 없음 (마지막 ADMIN 보호)
    if (teamMember.role === TeamRole.admin) {
      const adminCount = await this.teamMemberRepository.count({
        where: {
          team: { id: teamId },
          role: TeamRole.admin,
        },
      });

      if (adminCount <= 1) {
        throw new BadRequestException('팀에 최소 1명의 ADMIN이 있어야 합니다.');
      }
    }

    // 팀원 제거
    await this.teamMemberRepository.delete(teamMember.id);

    return {
      message: '팀원이 성공적으로 제거되었습니다.',
      removedUser: {
        id: teamMember.user.id,
        email: teamMember.user.email,
        nickname: teamMember.user.nickname,
      },
      teamId,
    };
  }

  /**
   * 특정 팀에서 사용자의 역할 확인
   * @param userId - 사용자 ID
   * @param teamId - 팀 ID
   * @returns TeamMemberEntity 또는 null
   */
  private async getUserRoleInTeam(userId: string, teamId: string): Promise<TeamMemberEntity | null> {
    return await this.teamMemberRepository.findOne({
      where: {
        user: { id: userId },
        team: { id: teamId },
      },
    });
  }


  /**
   * 팀 정보 업데이트 (ADMIN 권한 필요 - 가드에서 체크)
   * @param teamId - 팀 ID
   * @param updateTeamDto - 업데이트할 팀 정보
   * @returns 업데이트된 팀 정보
   */
  async update(teamId: string, updateTeamDto: UpdateTeamDto) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('팀을 찾을 수 없습니다.');
    }

    await this.teamRepository.update(teamId, updateTeamDto);

    return await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['members', 'members.user'],
    });
  }

  /**
   * 팀 삭제 (ADMIN 권한 필요 - 가드에서 체크)
   * 팀 삭제 시 팀원도 함께 삭제됩니다.
   * @param teamId - 팀 ID
   * @returns 삭제 성공 메시지
   */
  async remove(teamId: string) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('팀을 찾을 수 없습니다.');
    }

    // 팀 삭제 전에 모든 팀원 삭제
    await this.teamMemberRepository.delete({ team: { id: teamId } });

    // 팀 삭제
    await this.teamRepository.delete(teamId);

    return {
      message: '팀이 성공적으로 삭제되었습니다.',
      deletedTeamId: teamId,
    };
  }
}

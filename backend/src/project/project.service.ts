import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { ProjectEntity } from './entities/project.entity';
import { ProjectMemberEntity, projectRole } from './entities/projectMember.entity';
import { TeamEntity } from '../team/entities/team.entity';
import { UserEntity } from '../user/entities/user.entity';
import { TeamMemberEntity } from '../team/entities/teamMember.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectMemberEntity)
    private projectMemberRepository: Repository<ProjectMemberEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TeamMemberEntity)
    private teamMemberRepository: Repository<TeamMemberEntity>,
  ) {}

  async create(createProjectDto: CreateProjectDto, creatorId: string) {
    const team = await this.teamRepository.findOne({
      where: { id: createProjectDto.teamId },
    });
    
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const teamMember = await this.teamMemberRepository.findOne({
      where: {
        team: { id: createProjectDto.teamId },
        user: { id: creatorId },
      },
    });

    if (!teamMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    const project = this.projectRepository.create({
      name: createProjectDto.name,
      deadline: new Date(createProjectDto.deadline),
      team,
    });

    const savedProject = await this.projectRepository.save(project);

    const creator = await this.userRepository.findOne({
      where: { id: creatorId },
    });

    if (!creator) {
      throw new NotFoundException('Creator user not found');
    }

    const projectMember = this.projectMemberRepository.create({
      project: savedProject,
      user: creator,
      role: projectRole.admin,
    });

    await this.projectMemberRepository.save(projectMember);

    return savedProject;
  }

  async findAll() {
    return await this.projectRepository.find({
      relations: ['team', 'members', 'members.user'],
    });
  }

  async findOne(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['team', 'members', 'members.user'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async updateStatus(id: string, updateProjectDto: UpdateProjectDto) {
    await this.projectRepository.update(id, updateProjectDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    
    await this.projectRepository.delete(id);
    
    return { message: 'Project deleted successfully' };
  }

  async addMember(projectId: string, addMemberDto: AddMemberDto) {
    const project = await this.findOne(projectId);

    const user = await this.userRepository.findOne({
      where: { id: addMemberDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const teamMember = await this.teamMemberRepository.findOne({
      where: {
        team: { id: project.team.id },
        user: { id: addMemberDto.userId },
      },
    });

    if (!teamMember) {
      throw new BadRequestException('User must be a team member to be added to project');
    }

    const existingMember = await this.projectMemberRepository.findOne({
      where: {
        project: { id: projectId },
        user: { id: addMemberDto.userId },
      },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a project member');
    }

    const projectMember = this.projectMemberRepository.create({
      project,
      user,
      role: projectRole.member,
    });

    await this.projectMemberRepository.save(projectMember);
    
    return await this.findOne(projectId);
  }

  async removeMember(projectId: string, userId: string, requesterId: string) {
    await this.findOne(projectId);

    const memberToRemove = await this.projectMemberRepository.findOne({
      where: {
        project: { id: projectId },
        user: { id: userId },
      },
    });

    if (!memberToRemove) {
      throw new NotFoundException('Project member not found');
    }

    if (memberToRemove.role === projectRole.admin && userId === requesterId) {
      throw new BadRequestException('Project admin cannot remove themselves');
    }

    await this.projectMemberRepository.delete(memberToRemove.id);
    
    return { message: 'Member removed successfully' };
  }
}

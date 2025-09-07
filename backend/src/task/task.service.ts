import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { ProjectEntity } from '../project/entities/project.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ProjectMemberEntity } from '../project/entities/projectMember.entity';
import { TeamEntity } from '../team/entities/team.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProjectMemberEntity)
    private projectMemberRepository: Repository<ProjectMemberEntity>,
  ) {}

  async create(createTaskDto: CreateTaskDto, creatorId: string) {
    const project = await this.projectRepository.findOne({
      where: { id: createTaskDto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const creatorMember = await this.projectMemberRepository.findOne({
      where: {
        project: { id: createTaskDto.projectId },
        user: { id: creatorId },
      },
    });

    if (!creatorMember) {
      throw new BadRequestException('You are not a member of this project');
    }

    if (createTaskDto.userId) {
      const assignedUserMember = await this.projectMemberRepository.findOne({
        where: {
          project: { id: createTaskDto.projectId },
          user: { id: createTaskDto.userId },
        },
      });

      if (!assignedUserMember) {
        throw new BadRequestException('Assigned user is not a member of this project');
      }
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      deadline: new Date(createTaskDto.deadline),
      project: { id: createTaskDto.projectId } as ProjectEntity,
      user: createTaskDto.userId ? { id: createTaskDto.userId } as UserEntity : null,
    });

    return await this.taskRepository.save(task);
  }

  async findAll() {
    return await this.taskRepository.find({
      relations: ['project', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByProject(projectId: string) {
    return await this.taskRepository.find({
      where: { project: { id: projectId } },
      relations: ['project', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByUserId(userId: string) {
    return await this.taskRepository.find({
      where: { user: { id: userId } },
      relations: ['project', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByTeam(teamId: string) {
    return await this.taskRepository.find({
      where: { project: { team: { id: teamId } } },
      relations: ['project', 'project.team', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findMyTasks(userId: string, options?: {
    projectId?: string;
    status?: string;
  }) {
    const where: any = { user: { id: userId } };

    if (options?.projectId) {
      where.project = { id: options.projectId };
    }

    if (options?.status) {
      where.status = options.status;
    }

    return await this.taskRepository.find({
      where,
      relations: ['project', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'user'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.findOne(id);

    const projectMember = await this.projectMemberRepository.findOne({
      where: {
        project: { id: task.project.id },
        user: { id: userId },
      },
    });

    if (!projectMember) {
      throw new BadRequestException('You are not a member of this project');
    }

    if (updateTaskDto.userId) {
      const assignedUser = await this.userRepository.findOne({
        where: { id: updateTaskDto.userId },
      });

      if (!assignedUser) {
        throw new NotFoundException('Assigned user not found');
      }

      const assignedUserProjectMember = await this.projectMemberRepository.findOne({
        where: {
          project: { id: task.project.id },
          user: { id: updateTaskDto.userId },
        },
      });

      if (!assignedUserProjectMember) {
        throw new BadRequestException('Assigned user is not a member of this project');
      }

      task.user = assignedUser;
    }

    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.description) task.description = updateTaskDto.description;
    if (updateTaskDto.status) task.status = updateTaskDto.status;
    if (updateTaskDto.priority) task.priority = updateTaskDto.priority;
    if (updateTaskDto.deadline) task.deadline = new Date(updateTaskDto.deadline);

    return await this.taskRepository.save(task);
  }

  async remove(id: string, userId: string) {
    const task = await this.findOne(id);

    const projectMember = await this.projectMemberRepository.findOne({
      where: {
        project: { id: task.project.id },
        user: { id: userId },
      },
    });

    if (!projectMember) {
      throw new BadRequestException('You are not a member of this project');
    }

    await this.taskRepository.delete(id);
    return { message: 'Task deleted successfully' };
  }
}

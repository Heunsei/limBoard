import { IsString, IsDateString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @IsUUID()
    projectId: string;

    @IsOptional()
    @IsUUID()
    userId?: string;

    @IsDateString()
    deadline: string;
}

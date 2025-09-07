import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { projectStatus } from '../entities/project.entity';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsOptional()
    @IsEnum(projectStatus)
    status?: projectStatus;
}

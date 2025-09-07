import { IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    name: string;

    @IsDateString()
    deadline: string;

    @IsUUID()
    teamId: string;
}

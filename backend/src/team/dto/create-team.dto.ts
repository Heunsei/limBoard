import {IsNotEmpty, IsOptional, IsString} from "class-validator";

/**
 * CreateTeamDto
 * 
 * 팀 생성을 위한 DTO 클래스
 * 최초 팀 생성 시 요청자는 자동으로 ADMIN 역할로 팀에 추가됩니다.
 */
export class CreateTeamDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}

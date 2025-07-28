import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    nickname: string;

    @IsOptional()
    @IsString()
    description?: string;
}

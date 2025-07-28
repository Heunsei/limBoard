import {IsOptional, IsString} from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

import {UserEntity} from "../entities/user.entity";

export class UpdateUserDto extends PartialType(UserEntity) {
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    nickname?: string;
}

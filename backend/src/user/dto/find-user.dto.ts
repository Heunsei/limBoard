import { IsString, IsNotEmpty, IsIn } from "class-validator";

export class FindUserDto {
    @IsIn(['id', 'email'])
    @IsNotEmpty()
    type: 'id' | 'email';

    @IsString()
    @IsNotEmpty()
    value: string;
}
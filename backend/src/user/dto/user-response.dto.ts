import { UserEntity } from '../entities/user.entity';

export class UserResponseDto {
    id: string;
    email: string;
    nickname: string;
    description?: string;

    constructor(user: UserEntity) {
        this.id = user.id;
        this.email = user.email;
        this.nickname = user.nickname;
        this.description = user.description;
    }
}

export class UserDetailResponseDto extends UserResponseDto {
    createdAt: Date;
    updatedAt: Date;

    constructor(user: UserEntity) {
        super(user);
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}
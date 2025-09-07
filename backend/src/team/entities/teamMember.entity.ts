import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {TeamEntity} from "./team.entity";
import {UserEntity} from "../../user/entities/user.entity";

export enum TeamRole {
    member = 'MEMBER',
    manager = 'MANAGER',
    admin = 'ADMIN',
}

// 역할별 권한 레벨 (숫자가 클수록 높은 권한)
export const TEAM_ROLE_LEVELS: Record<TeamRole, number> = {
    [TeamRole.member]: 1,
    [TeamRole.manager]: 2,
    [TeamRole.admin]: 3,
} as const;

// 역할 표시명
export const TEAM_ROLE_NAMES: Record<TeamRole, string> = {
    [TeamRole.member]: 'MEMBER',
    [TeamRole.manager]: 'MANAGER',  
    [TeamRole.admin]: 'ADMIN',
} as const;

@Entity()
export class TeamMemberEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, user => user.teamMember)
    user: UserEntity;

    @ManyToOne(() => TeamEntity, team => team.members)
    team: TeamEntity;

    @Column({
        type: 'enum',
        enum: TeamRole,
        default: TeamRole.member,
    })
    role: TeamRole;
}
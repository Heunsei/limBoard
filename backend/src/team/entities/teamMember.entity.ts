import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {TeamEntity} from "./team.entity";

export enum TeamRole {
    member = 'MEMBER',
    admin = 'ADMIN',
}

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
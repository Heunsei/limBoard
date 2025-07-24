import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ProjectEntity} from "./project.entity";
import {UserEntity} from "../../user/entities/user.entity";

export enum projectRole {
    member = "MEMBER",
    admin = "ADMIN",
}

@Entity()
export class ProjectMemberEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ProjectEntity, project => project.members)
    project: ProjectEntity;

    @ManyToOne(() => UserEntity, user => user.projectMember)
    user: UserEntity;

    @Column({
        type: 'enum',
        enum: projectRole,
        default: projectRole.member,
    })
    role: projectRole;

    @CreateDateColumn()
    joinedAt: Date;
}

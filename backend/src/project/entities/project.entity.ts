import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {TeamEntity} from "../../team/entities/team.entity";
import {ProjectMemberEntity} from "./projectMember.entity";
import {TaskEntity} from "../../task/entities/task.entity";

export enum projectStatus {
    toDo = "TODO",
    inProgress = "IN_PROGRESS",
    completed = 'COMPLETED',
}

@Entity()
export class ProjectEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: projectStatus,
        default: projectStatus.toDo,
    })
    status: projectStatus;

    @Column({
        type:'date',
    })
    deadline: Date;

    @ManyToOne(() => TeamEntity, team => team.projects)
    team: TeamEntity;

    @OneToMany(() => ProjectMemberEntity, projectMember => projectMember.project)
    members: ProjectMemberEntity[];

    @OneToMany(() => TaskEntity, task => task.project)
    tasks: TaskEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}

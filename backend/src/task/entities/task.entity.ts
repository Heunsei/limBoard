import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ProjectEntity} from "../../project/entities/project.entity";
import {UserEntity} from "../../user/entities/user.entity";

export enum TaskStatus {
    todo = 'TODO',
    inProgress = 'IN_PROGRESS',
    completed = 'COMPLETED',
}

export enum TaskPriority {
    low = 'Low',
    medium = 'Medium',
    high = 'High',
}


@Entity()
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.todo,
    })
    status: TaskStatus;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.low,
    })
    priority: TaskPriority;

    @ManyToOne(() => ProjectEntity, project => project.tasks)
    project: ProjectEntity;

    @OneToMany(() => UserEntity, user => user.tasks)
    user: UserEntity;

    @Column()
    deadline: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

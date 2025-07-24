import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {IsEmail, IsString} from "class-validator";
import {TeamMemberEntity} from "../../team/entities/teamMember.entity";
import {ProjectMemberEntity} from "../../project/entities/projectMember.entity";
import {TaskEntity} from "../../task/entities/task.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
    })
    @IsEmail()
    email: string;

    @Column({
        unique: true,
    })
    @IsString()
    nickname: string;

    @Column()
    @IsString()
    password: string;

    @Column({
        nullable: true,
    })
    @IsString()
    description: string;

    @OneToMany(() => TeamMemberEntity, teamMember => teamMember.user)
    teamMember: TeamMemberEntity[];

    @OneToMany(() => ProjectMemberEntity, projectMember => projectMember.user)
    projectMember: ProjectMemberEntity[];

    @ManyToOne(() => TaskEntity, task => task.user)
    tasks: TaskEntity[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

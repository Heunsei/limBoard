import {Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {IsEmail, IsString} from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @IsString()
    nickname: string;

    @Column()
    @IsString()
    password: string;

    @Column()
    @IsString()
    description: string;

    // @ManyToMany()
    // teamMember: TeamMember[];
    //
    // @ManyToMany()
    // projectMember: ProjectMemeber[]
    //
    // @ManyToMany()
    // assignedTasks: Task[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

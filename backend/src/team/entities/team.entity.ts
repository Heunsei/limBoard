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
import {TeamMemberEntity} from "./teamMember.entity";

@Entity()
export class TeamEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({
        nullable: true
    })
    description: string;

    @ManyToOne(() => TeamMemberEntity, teamMember => teamMember.team)
    members: TeamMemberEntity[];

    @OneToMany(() => ProjectEntity, project => project.team)
    projects: ProjectEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

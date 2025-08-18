import {TaskType} from "@/type/task.type";
import {ProjectMemberType} from "@/type/project.type";
import {TeamMemberType} from "@/type/team.type";

interface UserType {
    id: string;
    email: string;
    nickname: string;
    password: string;
    description: string;
    teamMember: TeamMemberType[];
    projectMember: ProjectMemberType[];
    tasks: TaskType[]
    createdAt: Date;
    updatedAt: Date;
}

export type {
    UserType
}
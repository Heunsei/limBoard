import {TeamType} from "@/type/team.type";
import {TaskType} from "@/type/task.type";
import {UserType} from "@/type/user.type";

enum projectStatus {
    toDo = "TODO",
    inProgress = "IN_PROGRESS",
    completed = 'COMPLETED',
}

type ProjectType = {
    id: string;
    name: string;
    status: projectStatus;
    deadline: Date;
    team: TeamType;
    members: ProjectMemberType[];
    tasks: TaskType[];
    createdAt: Date;
    updatedAt: Date;
}

export enum projectRole {
    member = "MEMBER",
    admin = "ADMIN",
}

type ProjectMemberType = {
    id: string;
    project: ProjectType;
    user: UserType;
    role: projectRole;
    joinedAt: Date;
}

export type {
    ProjectType,
    ProjectMemberType
};
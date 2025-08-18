import {ProjectType} from "@/type/project.type";
import {UserType} from "@/type/user.type";

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


type TaskType = {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    project: ProjectType;
    user: UserType;
    deadline: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type {
    TaskType,
}
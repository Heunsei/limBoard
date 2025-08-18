import {UserType} from "@/type/user.type";
import {ProjectType} from "@/type/project.type";

type TeamType = {
    id: string;
    name: string;
    description: string;
    members: TeamMemberType[];
    projects: ProjectType[];
    createdAt: Date;
    updatedAt: Date;
}

enum TeamRole {
    member = 'MEMBER',
    admin = 'ADMIN',
}

type TeamMemberType = {
    id: string;
    user: UserType;
    team: TeamType;
    role: TeamRole;
}

export type {
    TeamType,
    TeamMemberType,
}
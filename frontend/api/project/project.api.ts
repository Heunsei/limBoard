import { apiRequest, ApiResponse } from "@/api";

// 프로젝트 생성
export interface CreateProjectRequest {
    name: string;
    deadline: string;
    teamId: string;
}

export async function createProject(projectData: CreateProjectRequest): Promise<ApiResponse> {
    return apiRequest('/project', {
        method: 'POST',
        body: JSON.stringify(projectData),
    });
}

// 모든 프로젝트 조회
export async function getAllProjects(): Promise<ApiResponse> {
    return apiRequest('/project', {
        method: 'GET',
    });
}

// 특정 프로젝트 조회
export async function getProject(projectId: string): Promise<ApiResponse> {
    return apiRequest(`/project/${projectId}`, {
        method: 'GET',
    });
}

// 프로젝트 상태 업데이트
export interface UpdateProjectStatusRequest {
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
}

export async function updateProjectStatus(projectId: string, statusData: UpdateProjectStatusRequest): Promise<ApiResponse> {
    return apiRequest(`/project/${projectId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData),
    });
}

// 프로젝트에 멤버 추가
export interface AddProjectMemberRequest {
    userId: string;
    role?: 'MEMBER' | 'ADMIN';
}

export async function addProjectMember(projectId: string, memberData: AddProjectMemberRequest): Promise<ApiResponse> {
    return apiRequest(`/project/${projectId}/members`, {
        method: 'POST',
        body: JSON.stringify(memberData),
    });
}

// 프로젝트에서 멤버 제거
export async function removeProjectMember(projectId: string, userId: string): Promise<ApiResponse> {
    return apiRequest(`/project/${projectId}/members/${userId}`, {
        method: 'DELETE',
    });
}

// 프로젝트 삭제
export async function deleteProject(projectId: string): Promise<ApiResponse> {
    return apiRequest(`/project/${projectId}`, {
        method: 'DELETE',
    });
}
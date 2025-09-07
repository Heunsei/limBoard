import { apiRequest, ApiResponse } from "@/api";

// 팀 생성
export interface CreateTeamRequest {
    name: string;
    description?: string;
}

export async function createTeam(teamData: CreateTeamRequest): Promise<ApiResponse> {
    return apiRequest('/team', {
        method: 'POST',
        body: JSON.stringify(teamData),
    });
}

// 팀 목록 조회 (내가 속한 팀들)
export async function getMyTeams(): Promise<ApiResponse> {
    return apiRequest('/team', {
        method: 'GET',
    });
}

// 특정 팀 조회
export async function getTeam(teamId: string): Promise<ApiResponse> {
    return apiRequest(`/team/${teamId}`, {
        method: 'GET',
    });
}

// 팀 정보 수정
export interface UpdateTeamRequest {
    name?: string;
    description?: string;
}

export async function updateTeam(teamId: string, teamData: UpdateTeamRequest): Promise<ApiResponse> {
    return apiRequest(`/team/${teamId}`, {
        method: 'PATCH',
        body: JSON.stringify(teamData),
    });
}

// 팀에 사용자 추가
export interface AddUserToTeamRequest {
    email: string;
    role?: 'MEMBER' | 'MANAGER' | 'ADMIN';
}

export async function addUserToTeam(teamId: string, userData: AddUserToTeamRequest): Promise<ApiResponse> {
    return apiRequest(`/team/${teamId}/add-user`, {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

// 팀에서 사용자 제거
export async function removeUserFromTeam(teamId: string, userId: string): Promise<ApiResponse> {
    return apiRequest(`/team/${teamId}/remove-user/${userId}`, {
        method: 'DELETE',
    });
}

// 팀 삭제
export async function deleteTeam(teamId: string): Promise<ApiResponse> {
    return apiRequest(`/team/${teamId}`, {
        method: 'DELETE',
    });
}
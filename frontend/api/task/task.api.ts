import { apiRequest, ApiResponse } from "@/api";

// 작업 생성
export interface CreateTaskRequest {
    title: string;
    description: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
    priority?: 'Low' | 'Medium' | 'High';
    projectId: string;
    userId?: string;
    deadline: string;
}

export async function createTask(taskData: CreateTaskRequest): Promise<ApiResponse> {
    return apiRequest('/task', {
        method: 'POST',
        body: JSON.stringify(taskData),
    });
}

// 모든 작업 조회
export async function getAllTasks(): Promise<ApiResponse> {
    return apiRequest('/task', {
        method: 'GET',
    });
}

// 특정 작업 조회
export async function getTask(taskId: string): Promise<ApiResponse> {
    return apiRequest(`/task/${taskId}`, {
        method: 'GET',
    });
}

// 프로젝트별 작업 조회
export async function getTasksByProject(projectId: string): Promise<ApiResponse> {
    return apiRequest(`/task/project/${projectId}`, {
        method: 'GET',
    });
}

// 사용자별 작업 조회
export async function getTasksByUser(userId: string): Promise<ApiResponse> {
    return apiRequest(`/task/user/${userId}`, {
        method: 'GET',
    });
}

// 팀별 작업 조회
export async function getTasksByTeam(teamId: string): Promise<ApiResponse> {
    return apiRequest(`/task/team/${teamId}`, {
        method: 'GET',
    });
}

// 내 작업 조회 (필터 옵션 포함)
export interface MyTasksFilters {
    projectId?: string;
    status?: string;
}

export async function getMyTasks(filters?: MyTasksFilters): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters?.projectId) {
        queryParams.append('projectId', filters.projectId);
    }
    if (filters?.status) {
        queryParams.append('status', filters.status);
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/task/my-tasks?${queryString}` : '/task/my-tasks';
    
    return apiRequest(endpoint, {
        method: 'GET',
    });
}

// 작업 업데이트
export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
    priority?: 'Low' | 'Medium' | 'High';
    userId?: string;
    deadline?: string;
}

export async function updateTask(taskId: string, taskData: UpdateTaskRequest): Promise<ApiResponse> {
    return apiRequest(`/task/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(taskData),
    });
}

// 작업 삭제
export async function deleteTask(taskId: string): Promise<ApiResponse> {
    return apiRequest(`/task/${taskId}`, {
        method: 'DELETE',
    });
}
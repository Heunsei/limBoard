import { apiRequest, ApiResponse } from "../common/api.util";

// 사용자 검색 (이메일로)
export async function findUserByEmail(email: string): Promise<ApiResponse> {
    return apiRequest(`/user/find?email=${encodeURIComponent(email)}`, {
        method: 'GET',
    });
}

// 사용자 상세 정보 검색
export async function findUserDetail(email: string): Promise<ApiResponse> {
    return apiRequest(`/user/find/detail?email=${encodeURIComponent(email)}`, {
        method: 'GET',
    });
}

// 사용자 정보 수정
export interface UpdateUserRequest {
    nickname?: string;
    description?: string;
}

export async function updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse> {
    return apiRequest(`/user/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
    });
}

// 사용자 삭제
export async function deleteUser(id: string): Promise<ApiResponse> {
    return apiRequest(`/user/${id}`, {
        method: 'DELETE',
    });
}
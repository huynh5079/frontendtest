import type { AdminCancelClassParams, AdminCancelStudentEnrollmentParams } from "../../../types/class";
import request from "../../request";

export const adminGetAllClassesApi = async (status?: string) => {
    try {
        // Gọi endpoint admin mới để lấy tất cả classes
        const url = status ? `admin/classes?status=${status}` : 'admin/classes';
        console.log('🔍 Calling API:', url);
        const response = await request.get(url);
        console.log('📦 Full response:', response);
        console.log('📦 response.data:', response.data);
        console.log('📦 response.data keys:', response.data ? Object.keys(response.data) : 'no data');
        
        // Backend trả về ApiResponse<IEnumerable<ClassDto>>
        // Response format: { status/Status, message/Message, data/Data: [ClassDto, ...] }
        // Handle both camelCase and PascalCase property names
        if (response.data) {
            const apiResponse = response.data;
            
            // Kiểm tra response.data.data hoặc response.data.Data (nested data từ ApiResponse)
            const classesData = apiResponse.data || apiResponse.Data;
            
            if (classesData && Array.isArray(classesData)) {
                console.log('✅ Found classes in response.data.data/Data:', classesData.length);
                return {
                    data: classesData
                };
            }
            
            // Nếu response.data là array trực tiếp (fallback - không có ApiResponse wrapper)
            if (Array.isArray(apiResponse)) {
                console.log('✅ Found classes in response.data (array):', apiResponse.length);
                return {
                    data: apiResponse
                };
            }
            
            console.warn('⚠️ Unexpected response format. Full response.data:', JSON.stringify(apiResponse, null, 2));
        }
        
        console.warn('⚠️ No data found, returning empty array');
        return {
            data: []
        };
    } catch (error: any) {
        console.error('❌ Failed to fetch classes from admin endpoint:', error);
        console.error('❌ Error response:', error.response?.data);
        console.error('❌ Error status:', error.response?.status);
        throw error;
    }
};

export const adminGetClassDetailApi = async (classId: string) => {
    const response = await request.get(`admin/classes/${classId}/detail`);
    // Handle both camelCase and PascalCase
    const apiResponse = response.data;
    return apiResponse?.data || apiResponse?.Data || apiResponse;
};

export interface StudentEnrollmentDto {
    studentId: string;
    studentName: string;
    studentEmail?: string;
    studentAvatarUrl?: string;
    studentPhone?: string;
    approvalStatus: string;
    paymentStatus: string;
    enrolledAt?: string;
    createdAt: string;
}

export const adminGetStudentsInClassApi = async (classId: string) => {
    const response = await request.get(`admin/classes/${classId}/students`);
    // Handle both camelCase and PascalCase
    const apiResponse = response.data;
    return apiResponse?.data || apiResponse?.Data || apiResponse;
};

export const adminCancelClassApi = async (
    classId: string,
    params: AdminCancelClassParams
) => {
    const data = await request.post(`admin/classes/${classId}/cancel`, params);
    return data.data;
};

export const adminCancelStudentEnrollmentApi = async (
    classId: string,
    studentId: string,
    params: AdminCancelStudentEnrollmentParams
) => {
    const data = await request.post(
        `admin/classes/${classId}/students/${studentId}/cancel`,
        params
    );
    return data.data;
};

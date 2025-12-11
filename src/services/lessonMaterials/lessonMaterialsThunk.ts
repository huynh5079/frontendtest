import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getLessonMaterialsApi,
    uploadLessonMaterialsApi,
    deleteLessonMaterialApi,
} from "./lessonMaterialsApi";
import type { MaterialItemDto } from "../../types/lesson-materials";

// Get Materials
export const getLessonMaterialsApiThunk = createAsyncThunk<
    MaterialItemDto[],
    string,
    { rejectValue: string }
>("lessonMaterials/get", async (lessonId, { rejectWithValue }) => {
    try {
        const response = await getLessonMaterialsApi(lessonId);
        if (response.status?.toLowerCase() === "success") {
            return Array.isArray(response.data) ? response.data : [];
        }
        return rejectWithValue(response.message || "Lỗi không xác định");
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || error?.message || "Lỗi khi lấy danh sách tài liệu"
        );
    }
});

// Upload Materials
export const uploadLessonMaterialsApiThunk = createAsyncThunk<
    MaterialItemDto[],
    { lessonId: string; files: File[] },
    { rejectValue: string }
>("lessonMaterials/upload", async ({ lessonId, files }, { rejectWithValue }) => {
    try {
        console.log("📤 Uploading files:", files.map(f => ({ name: f.name, size: f.size, type: f.type })));
        const response = await uploadLessonMaterialsApi(lessonId, files);
        console.log("📥 Upload API response:", response);

        if (response.status?.toLowerCase() === "success") {
            const data = Array.isArray(response.data) ? response.data : [];
            console.log("✅ Upload success - Data:", data);
            return data;
        }
        console.warn("⚠️ Upload response status not success:", response.status);
        return rejectWithValue(response.message || "Lỗi không xác định");
    } catch (error: any) {
        console.error("❌ Upload error:", error);
        return rejectWithValue(
            error.response?.data?.message || error?.message || "Lỗi khi upload tài liệu"
        );
    }
});

// Delete Material
export const deleteLessonMaterialApiThunk = createAsyncThunk<
    string,
    { lessonId: string; mediaId: string },
    { rejectValue: string }
>(
    "lessonMaterials/delete",
    async ({ lessonId, mediaId }, { rejectWithValue }) => {
        try {
            const response = await deleteLessonMaterialApi(lessonId, mediaId);
            if (response.status?.toLowerCase() === "success") {
                return mediaId;
            }
            return rejectWithValue(response.message || "Lỗi không xác định");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error?.message || "Lỗi khi xóa tài liệu"
            );
        }
    }
);


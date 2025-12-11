import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    getLessonMaterialsApiThunk,
    uploadLessonMaterialsApiThunk,
    deleteLessonMaterialApiThunk,
} from "./lessonMaterialsThunk";
import type { MaterialItemDto } from "../../types/lesson-materials";

interface LessonMaterialsState {
    materials: MaterialItemDto[];
    isLoading: boolean;
    error: string | null;
}

const initialState: LessonMaterialsState = {
    materials: [],
    isLoading: false,
    error: null,
};

export const lessonMaterialsSlice = createSlice({
    name: "lessonMaterials",
    initialState,
    reducers: {
        clearMaterials: (state) => {
            state.materials = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Get Materials
        builder
            .addCase(getLessonMaterialsApiThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                getLessonMaterialsApiThunk.fulfilled,
                (state, action: PayloadAction<MaterialItemDto[]>) => {
                    state.isLoading = false;
                    state.error = null;
                    console.log("📥 Get Materials fulfilled - Payload:", action.payload);
                    console.log("📥 Get Materials - Payload length:", Array.isArray(action.payload) ? action.payload.length : "N/A");
                    console.log("📥 Get Materials - Current materials before replace:", state.materials);
                    // Replace toàn bộ materials với data mới từ API
                    state.materials = Array.isArray(action.payload) ? action.payload : [];
                    console.log("📥 Get Materials - Updated state.materials:", state.materials);
                    console.log("📥 Get Materials - Updated count:", state.materials.length);
                }
            )
            .addCase(getLessonMaterialsApiThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Lỗi khi lấy danh sách tài liệu";
            });

        // Upload Materials
        builder
            .addCase(uploadLessonMaterialsApiThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                uploadLessonMaterialsApiThunk.fulfilled,
                (state, action: PayloadAction<MaterialItemDto[]>) => {
                    state.isLoading = false;
                    state.error = null;
                    console.log("📦 Upload fulfilled - Payload:", action.payload);
                    console.log("📦 Payload type:", typeof action.payload, "Is array:", Array.isArray(action.payload));
                    console.log("📦 Payload length:", Array.isArray(action.payload) ? action.payload.length : "N/A");
                    console.log("📦 Current materials before update:", state.materials);
                    console.log("📦 Current materials count:", state.materials.length);

                    // Kiểm tra payload chi tiết
                    console.log("📦 Payload check - Is array:", Array.isArray(action.payload));
                    console.log("📦 Payload check - Length:", Array.isArray(action.payload) ? action.payload.length : "N/A");
                    console.log("📦 Payload check - First item:", Array.isArray(action.payload) && action.payload.length > 0 ? action.payload[0] : "N/A");

                    if (Array.isArray(action.payload) && action.payload.length > 0) {
                        const existingIds = new Set(state.materials.map(m => m.id));
                        const newMaterials = action.payload.filter(m => !existingIds.has(m.id));
                        console.log("📦 New materials to add:", newMaterials);
                        console.log("📦 New materials count:", newMaterials.length);

                        if (newMaterials.length > 0) {
                            state.materials = [...state.materials, ...newMaterials];
                            console.log("✅ Updated materials after upload:", state.materials);
                            console.log("✅ Updated materials count:", state.materials.length);
                        } else {
                            console.warn("⚠️ Tất cả materials đã tồn tại, không cần thêm");
                        }
                    } else {
                        console.warn("⚠️ Upload response rỗng hoặc không hợp lệ:", action.payload);
                        console.warn("⚠️ Payload type:", typeof action.payload);
                        console.warn("⚠️ Payload value:", JSON.stringify(action.payload));
                    }
                }
            )
            .addCase(uploadLessonMaterialsApiThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Lỗi khi upload tài liệu";
            });

        // Delete Material
        builder
            .addCase(deleteLessonMaterialApiThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                deleteLessonMaterialApiThunk.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.isLoading = false;
                    state.materials = state.materials.filter(
                        (m) => m.id !== action.payload
                    );
                }
            )
            .addCase(deleteLessonMaterialApiThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Lỗi khi xóa tài liệu";
            });
    },
});

export const { clearMaterials } = lessonMaterialsSlice.actions;
export default lessonMaterialsSlice.reducer;


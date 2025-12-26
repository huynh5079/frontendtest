import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../../types/app";
import type { PublicClass } from "../../../types/public";
import type { StudentEnrollmentDto } from "./adminClassApi";
import {
    adminGetAllClassesApiThunk,
    adminGetClassDetailApiThunk,
    adminGetStudentsInClassApiThunk,
} from "./adminClassThunk";

type AdminClassState = {
    listClasses: PublicClass[];
    classDetail: PublicClass | null;
    studentsInClass: StudentEnrollmentDto[];
    loading: boolean;
    studentsLoading: boolean;
    error: string | null;
};

const initialState: AdminClassState = {
    listClasses: [],
    classDetail: null,
    studentsInClass: [],
    loading: false,
    studentsLoading: false,
    error: null,
};

export const adminClassSlice = createSlice({
    name: "adminClass",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(adminGetAllClassesApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                adminGetAllClassesApiThunk.fulfilled,
                (state, action: PayloadAction<ResponseFromServer<PublicClass[] | { items: PublicClass[]; page: number; size: number; total: number }>>) => {
                    console.log('📥 Slice received action.payload:', action.payload);
                    const data = action.payload.data;
                    console.log('📥 Slice received data:', data);
                    // Handle both array and paginated response formats
                    if (Array.isArray(data)) {
                        console.log('✅ Slice: data is array, length:', data.length);
                        state.listClasses = data;
                    } else if (data && typeof data === 'object' && 'items' in data) {
                        console.log('✅ Slice: data has items property');
                        state.listClasses = (data as any).items || [];
                    } else {
                        console.warn('⚠️ Slice: Unexpected data format, setting empty array');
                        state.listClasses = [];
                    }
                    console.log('✅ Slice: Final listClasses length:', state.listClasses.length);
                    state.loading = false;
                    state.error = null;
                }
            )
            .addCase(adminGetAllClassesApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Lỗi khi tải danh sách lớp học";
            })
            .addCase(adminGetClassDetailApiThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                adminGetClassDetailApiThunk.fulfilled,
                (state, action: PayloadAction<ResponseFromServer<PublicClass>>) => {
                    state.classDetail = action.payload.data || null;
                    state.loading = false;
                    state.error = null;
                }
            )
            .addCase(adminGetClassDetailApiThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Lỗi khi tải chi tiết lớp học";
            })
            .addCase(adminGetStudentsInClassApiThunk.pending, (state) => {
                state.studentsLoading = true;
                state.error = null;
            })
            .addCase(
                adminGetStudentsInClassApiThunk.fulfilled,
                (state, action: PayloadAction<ResponseFromServer<StudentEnrollmentDto[]>>) => {
                    state.studentsInClass = action.payload.data || [];
                    state.studentsLoading = false;
                    state.error = null;
                }
            )
            .addCase(adminGetStudentsInClassApiThunk.rejected, (state, action) => {
                state.studentsLoading = false;
                state.error = action.error.message || "Lỗi khi tải danh sách học viên";
            });
    },
});

export const { } = adminClassSlice.actions;

export default adminClassSlice.reducer;


import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    getProfileParentApiThunk,
    getProfileStudentApiThunk,
    getProfileTutorApiThunk,
} from "./userThunk";
import type { ResponseFromServer } from "../../types/app";
import type {
    ParentProfile,
    ProfileStudent,
    UserState,
} from "../../types/user";
import type { TutorProfile } from "../../types/tutor";

const initialState: UserState = {
    tutorProfile: null,
    parentProfile: null,
    studentProfile: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getProfileTutorApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<TutorProfile>>,
                ) => {
                    state.tutorProfile = action.payload.data;
                },
            )
            .addCase(
                getProfileParentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<ParentProfile>>,
                ) => {
                    state.parentProfile = action.payload.data;
                },
            )
            .addCase(
                getProfileStudentApiThunk.fulfilled,
                (
                    state,
                    action: PayloadAction<ResponseFromServer<ProfileStudent>>,
                ) => {
                    state.studentProfile = action.payload.data;
                },
            );
    },
});

export const {} = userSlice.actions;

export default userSlice.reducer;

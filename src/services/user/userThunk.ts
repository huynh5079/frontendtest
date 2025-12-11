import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../types/app";
import {
    getProfileParentApi,
    getProfileStudentApi,
    getProfileTutorApi,
    updateProfileStudentApi,
    updateProfileTutorApi,
} from "./userApi";
import type { TutorProfile, TutorProfileUpdateParams } from "../../types/tutor";
import type {
    ParentProfile,
    ProfileStudent,
    UpdateStudentProfileParams,
} from "../../types/user";
import request from "../request";

const GET_PROFILE_TUTOR = "GET_PROFILE_TUTOR";
const GET_PROFILE_PARENT = "GET_PROFILE_PARENT";
const GET_PROFILE_STUDENT = "GET_PROFILE_STUDENT";
const UPDATE_PROFILE_STUDENT = "UPDATE_PROFILE_STUDENT";
const UPDATE_PROFILE_TUTOR = "UPDATE_PROFILE_TUTOR";

export const getProfileTutorApiThunk = createAsyncThunk<
    ResponseFromServer<TutorProfile>
>(GET_PROFILE_TUTOR, async (_, { rejectWithValue }) => {
    try {
        const response = await getProfileTutorApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getProfileParentApiThunk = createAsyncThunk<
    ResponseFromServer<ParentProfile>
>(GET_PROFILE_PARENT, async (_, { rejectWithValue }) => {
    try {
        const response = await getProfileParentApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getProfileStudentApiThunk = createAsyncThunk<
    ResponseFromServer<ProfileStudent>
>(GET_PROFILE_STUDENT, async (_, { rejectWithValue }) => {
    try {
        const response = await getProfileStudentApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const updateProfileStudentApiThunk = createAsyncThunk<
    ResponseFromServer<{}>,
    UpdateStudentProfileParams
>(UPDATE_PROFILE_STUDENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateProfileStudentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const updateProfileTutorApiThunk = createAsyncThunk(
    UPDATE_PROFILE_TUTOR,
    async (data: FormData, { rejectWithValue }) => {
        try {
            const res = await request.post("/profile/update/tutor", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

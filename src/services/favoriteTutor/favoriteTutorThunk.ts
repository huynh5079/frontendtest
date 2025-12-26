import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    checkFavoriteTutorApi,
    deleteFavoriteTutorApi,
    favoriteTutorApi,
    getAllFavoriteTutorApi,
} from "./favoriteTutorApi";
import type { ResponseFromServer } from "../../types/app";
import type {
    CheckFavoriteTutorRessponse,
    GetAllFavoriteTutor,
} from "../../types/favorite-tutor";

const FAVOURITE_TUTOR = "FAVOURITE_TUTOR";
const CHECK_FAVOURITE_TUTOR = "CHECK_FAVOURITE_TUTOR";
const DELETE_FAVOURITE_TUTOR = "DELETE_FAVOURITE_TUTOR";
const GET_ALL_FAVORITE_TUTOR = "GET_ALL_FAVORITE_TUTOR";

export const favoriteTutorApiThunk = createAsyncThunk<{}, string>(
    FAVOURITE_TUTOR,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await favoriteTutorApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const checkFavoriteTutorApiThunk = createAsyncThunk<
    ResponseFromServer<CheckFavoriteTutorRessponse>,
    string
>(CHECK_FAVOURITE_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await checkFavoriteTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const deleteFavoriteTutorApiThunk = createAsyncThunk<{}, string>(
    DELETE_FAVOURITE_TUTOR,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await deleteFavoriteTutorApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const getAllFavoriteTutorApiThunk = createAsyncThunk<
    ResponseFromServer<GetAllFavoriteTutor[]>
>(GET_ALL_FAVORITE_TUTOR, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllFavoriteTutorApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

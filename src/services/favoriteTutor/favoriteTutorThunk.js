import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkFavoriteTutorApi, deleteFavoriteTutorApi, favoriteTutorApi, } from "./favoriteTutorApi";
const FAVOURITE_TUTOR = "FAVOURITE_TUTOR";
const CHECK_FAVOURITE_TUTOR = "CHECK_FAVOURITE_TUTOR";
const DELETE_FAVOURITE_TUTOR = "DELETE_FAVOURITE_TUTOR";
export const favoriteTutorApiThunk = createAsyncThunk(FAVOURITE_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await favoriteTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const checkFavoriteTutorApiThunk = createAsyncThunk(CHECK_FAVOURITE_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await checkFavoriteTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
export const deleteFavoriteTutorApiThunk = createAsyncThunk(DELETE_FAVOURITE_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await deleteFavoriteTutorApi(payload);
        return response;
    }
    catch (err) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

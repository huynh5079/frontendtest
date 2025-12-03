import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    checkFavoriteTutorApi,
    deleteFavoriteTutorApi,
    favoriteTutorApi,
} from "./favoriteTutorApi";
import type { ResponseFromServer } from "../../types/app";
import type { CheckFavoriteTutorRessponse } from "../../types/favorite-tutor";

const FAVOURITE_TUTOR = "FAVOURITE_TUTOR";
const CHECK_FAVOURITE_TUTOR = "CHECK_FAVOURITE_TUTOR";
const DELETE_FAVOURITE_TUTOR = "DELETE_FAVOURITE_TUTOR";

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
    },
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
    },
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { BookingForTutor } from "../../../types/tutor";
import {
    acceptBookingForTutorApi,
    getAllBookingForTutorApi,
    getDetailBookingForTutorApi,
    rejectBookingForTutorApi,
} from "./bookingApi";

const GET_ALL_BOOKING_FOR_TUTOR = "GET_ALL_BOOKING_FOR_TUTOR";
const GET_DETAIL_BOOKING_FOR_TUTOR = "GET_DETAIL_BOOKING_FOR_TUTOR";
const ACCEPT_BOOKING_FOR_TUTOR = "ACCEPT_BOOKING_FOR_TUTOR";
const REJECT_BOOKING_FOR_TUTOR = "REJECT_BOOKING_FOR_TUTOR";

export const getAllBookingForTutorApiThunk = createAsyncThunk<
    BookingForTutor[]
>(GET_ALL_BOOKING_FOR_TUTOR, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllBookingForTutorApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getDetailBookingForTutorApiThunk = createAsyncThunk<
    BookingForTutor,
    string
>(GET_DETAIL_BOOKING_FOR_TUTOR, async (payload, { rejectWithValue }) => {
    try {
        const response = await getDetailBookingForTutorApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const acceptBookingForTutorApiThunk = createAsyncThunk<{}, string>(
    ACCEPT_BOOKING_FOR_TUTOR,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await acceptBookingForTutorApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const rejectBookingForTutorApiThunk = createAsyncThunk<{}, string>(
    REJECT_BOOKING_FOR_TUTOR,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await rejectBookingForTutorApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

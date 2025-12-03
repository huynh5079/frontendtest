import { createSlice } from "@reduxjs/toolkit";
import { acceptTutorApiThunk, getAllTutorForAdminApiThunk, getDetailTutorForAdminApiThunk, provideTutorApiThunk, rejectTutorApiThunk, } from "./adminTutorThunk";
const initialState = {
    listTutors: [],
    tutor: null,
};
export const tutorForAdminSlice = createSlice({
    name: "tutorForAdmin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTutorForAdminApiThunk.fulfilled, (state, action) => {
            state.listTutors = action.payload.data;
        })
            .addCase(getDetailTutorForAdminApiThunk.fulfilled, (state, action) => {
            state.tutor = action.payload.data;
        })
            .addCase(acceptTutorApiThunk.fulfilled, (state, action) => {
            state.tutor = action.payload.data;
        })
            .addCase(rejectTutorApiThunk.fulfilled, (state, action) => {
            state.tutor = action.payload.data;
        })
            .addCase(provideTutorApiThunk.fulfilled, (state, action) => {
            state.tutor = action.payload.data;
        });
    },
});
export const {} = tutorForAdminSlice.actions;
export default tutorForAdminSlice.reducer;

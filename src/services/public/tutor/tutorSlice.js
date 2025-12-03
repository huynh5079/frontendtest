import { createSlice } from "@reduxjs/toolkit";
import { publicGetAllTutorsApiThunk, publicGetDetailTutorApiThunk, } from "./tutorThunk";
const initialState = {
    listTutors: null,
    tutor: null,
};
export const publicTutorSlice = createSlice({
    name: "publicTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(publicGetAllTutorsApiThunk.fulfilled, (state, action) => {
            state.listTutors = action.payload.data;
        })
            .addCase(publicGetDetailTutorApiThunk.fulfilled, (state, action) => {
            state.tutor = action.payload.data;
        });
    },
});
export const {} = publicTutorSlice.actions;
export default publicTutorSlice.reducer;

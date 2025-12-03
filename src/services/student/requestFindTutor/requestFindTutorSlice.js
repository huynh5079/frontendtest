import { createSlice } from "@reduxjs/toolkit";
import { getAllApplyRequestFindTutorForStudentApiThunk } from "./requestFindTutorThunk";
const initialState = {
    list: [],
};
export const requestFindTutorForStudentSlice = createSlice({
    name: "requestFindTutorForStudent",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllApplyRequestFindTutorForStudentApiThunk.fulfilled, (state, action) => {
            state.list = action.payload.data;
        });
    },
});
export const {} = requestFindTutorForStudentSlice.actions;
export default requestFindTutorForStudentSlice.reducer;

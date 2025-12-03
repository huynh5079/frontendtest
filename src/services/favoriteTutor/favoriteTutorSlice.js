import { createSlice } from "@reduxjs/toolkit";
import { checkFavoriteTutorApiThunk } from "./favoriteTutorThunk";
const initialState = {
    isFavorited: null,
};
export const favoriteTutorSlice = createSlice({
    name: "favoriteTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(checkFavoriteTutorApiThunk.fulfilled, (state, action) => {
            state.isFavorited = action.payload.data;
        });
    },
});
export const {} = favoriteTutorSlice.actions;
export default favoriteTutorSlice.reducer;

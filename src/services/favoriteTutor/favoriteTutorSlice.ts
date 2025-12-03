import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ResponseFromServer } from "../../types/app";
import type {
    CheckFavoriteTutorRessponse,
    FavoriteTutorState,
} from "../../types/favorite-tutor";
import { checkFavoriteTutorApiThunk } from "./favoriteTutorThunk";

const initialState: FavoriteTutorState = {
    isFavorited: null,
};

export const favoriteTutorSlice = createSlice({
    name: "favoriteTutor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            checkFavoriteTutorApiThunk.fulfilled,
            (
                state,
                action: PayloadAction<
                    ResponseFromServer<CheckFavoriteTutorRessponse>
                >,
            ) => {
                state.isFavorited = action.payload.data;
            },
        );
    },
});

export const {} = favoriteTutorSlice.actions;

export default favoriteTutorSlice.reducer;

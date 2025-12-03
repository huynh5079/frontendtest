// src/features/auth/registerTutorSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RegisterTutor } from "../../types/auth";

export interface RegisterTutorState {
    formData: RegisterTutor | null;
}

const initialState: RegisterTutorState = {
    formData: null,
};

export const registerTutorSlice = createSlice({
    name: "registerTutor",
    initialState,
    reducers: {
        setRegisterTutorData: (state, action: PayloadAction<RegisterTutor>) => {
            state.formData = action.payload;
        },
        clearRegisterTutorData: (state) => {
            state.formData = null;
        },
    },
});

export const { setRegisterTutorData, clearRegisterTutorData } =
    registerTutorSlice.actions;
export default registerTutorSlice.reducer;

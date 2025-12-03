// src/features/auth/registerTutorSlice.ts
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    formData: null,
};
export const registerTutorSlice = createSlice({
    name: "registerTutor",
    initialState,
    reducers: {
        setRegisterTutorData: (state, action) => {
            state.formData = action.payload;
        },
        clearRegisterTutorData: (state) => {
            state.formData = null;
        },
    },
});
export const { setRegisterTutorData, clearRegisterTutorData } = registerTutorSlice.actions;
export default registerTutorSlice.reducer;

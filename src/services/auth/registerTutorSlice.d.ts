import { type PayloadAction } from "@reduxjs/toolkit";
import type { RegisterTutor } from "../../types/auth";
export interface RegisterTutorState {
    formData: RegisterTutor | null;
}
export declare const registerTutorSlice: import("@reduxjs/toolkit").Slice<RegisterTutorState, {
    setRegisterTutorData: (state: import("immer").WritableDraft<RegisterTutorState>, action: PayloadAction<RegisterTutor>) => void;
    clearRegisterTutorData: (state: import("immer").WritableDraft<RegisterTutorState>) => void;
}, "registerTutor", "registerTutor", import("@reduxjs/toolkit").SliceSelectors<RegisterTutorState>>;
export declare const setRegisterTutorData: import("@reduxjs/toolkit").ActionCreatorWithPayload<RegisterTutor, "registerTutor/setRegisterTutorData">, clearRegisterTutorData: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"registerTutor/clearRegisterTutorData">;
declare const _default: import("redux").Reducer<RegisterTutorState>;
export default _default;

import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppGlobalState } from "../../types/app";
export declare const appSlice: import("@reduxjs/toolkit").Slice<AppGlobalState, {
    setLoading: (state: import("immer").WritableDraft<AppGlobalState>, action: PayloadAction<boolean>) => void;
}, "app", "app", import("@reduxjs/toolkit").SliceSelectors<AppGlobalState>>;
export declare const setLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "app/setLoading">;
declare const _default: import("redux").Reducer<AppGlobalState>;
export default _default;

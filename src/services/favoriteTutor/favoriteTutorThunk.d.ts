import type { ResponseFromServer } from "../../types/app";
import type { CheckFavoriteTutorRessponse } from "../../types/favorite-tutor";
export declare const favoriteTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const checkFavoriteTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<ResponseFromServer<CheckFavoriteTutorRessponse>, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const deleteFavoriteTutorApiThunk: import("@reduxjs/toolkit").AsyncThunk<{}, string, import("@reduxjs/toolkit").AsyncThunkConfig>;

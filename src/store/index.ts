import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";

// El store vive solo en memoria: lo único que persiste es el token
export const store = configureStore({
    reducer: {
        profile: profileReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

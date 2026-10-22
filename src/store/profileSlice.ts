import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Solo lo que muestra Mi Perfil: nombre y correo
export interface ProfileData {
    nombre: string;
    email: string;
}

interface ProfileState {
    data: ProfileData | null;
}

const initialState: ProfileState = {
    data: null,
};

// Convierte el usuario que devuelve la API en los datos que guarda el store
export function toProfileData(user: {
    email: string;
    nombre?: string;
    apellido?: string;
}): ProfileData {
    const nombre = user.nombre
        ? `${user.nombre} ${user.apellido ?? ""}`.trim()
        : "";
    return { nombre, email: user.email };
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfile(state, action: PayloadAction<ProfileData>) {
            state.data = action.payload;
        },
        clearProfile(state) {
            state.data = null;
        },
    },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

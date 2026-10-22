import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { Provider } from "react-redux";

import { store } from "../store";
import { useAppSelector } from "../store/hooks";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/Loading";

function RootNavigator() {

    const router = useRouter();
    const segments = useSegments() as unknown as string[];
    const profile = useAppSelector((state) => state.profile.data);
    const { checkAuth } = useAuth();

    const [ready, setReady] = useState(false);

    // 1) Al abrir la app: si hay token guardado, se pide el perfil a la API
    useEffect(() => {
        checkAuth().finally(() => setReady(true));
    }, [checkAuth]);

    // 2) Redirección según haya o no sesión (login y registro son públicos)
    const isPublic =
        segments.length === 0 ||
        segments[0] === "index" ||
        segments[0] === "register";

    useEffect(() => {
        if (!ready) return;

        if (profile && isPublic) {
            router.replace("/home");
        } else if (!profile && !isPublic) {
            router.replace("/");
        }
    }, [ready, profile, isPublic]);

    return (
        <>
            <Stack>

                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
                <Stack.Screen name="home" options={{ headerShown: false }} />
                <Stack.Screen name="profile" options={{ headerShown: false }} />
                <Stack.Screen name="settings" options={{ headerShown: false }} />

            </Stack>

            {!ready && (
                <View style={StyleSheet.absoluteFill}>
                    <Loading fullScreen message="Cargando..." />
                </View>
            )}
        </>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <RootNavigator />
        </Provider>
    );
}

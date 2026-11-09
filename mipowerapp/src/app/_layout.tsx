import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Provider, useDispatch } from "react-redux";
import { Stack } from "expo-router";

import { store, setUser, setToken } from "../store/store"; // Ajusta la ruta a tu store
import { getStorage } from "../utils/authStorage"; // Ajusta la ruta a tu utils
import ErrorBoundary from "../components/ErrorBoundary";
import { AuthProvider } from "../context/AuthContext";
import { G, headerOptions } from "../constants/design";

function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const [isRestoring, setIsRestoring] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const token = await getStorage("user_token");
                const savedUser = await getStorage("user_info");

                if (token && savedUser) {
                    dispatch(setToken(token));
                    dispatch(setUser(JSON.parse(savedUser)));
                }
            } catch (error) {
                console.error("Error al restaurar sesión:", error);
            } finally {
                setIsRestoring(false);
            }
        };

        restoreSession();
    }, [dispatch]);

    if (isRestoring) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: G.bg }}>
                <ActivityIndicator size="large" color={G.accent} />
            </View>
        );
    }

    return <>{children}</>;
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <AuthInitializer>
                    <ErrorBoundary>
                        <Stack screenOptions={{ contentStyle: { backgroundColor: G.bg } }}>

                            <Stack.Screen
                                name="index"
                                options={{ headerShown: false }}
                            />

                            <Stack.Screen
                                name="home"
                                options={{ headerShown: false }}
                            />

                            <Stack.Screen
                                name="profile"
                                options={{ headerShown: false }}
                            />

                            <Stack.Screen
                                name="settings"
                                options={{ headerShown: false }}
                            />

                            <Stack.Screen
                                name="students"
                                options={{
                                    title: "Estudiantes",
                                    ...headerOptions,
                                }}
                            />

                            <Stack.Screen
                                name="student/[id]"
                                options={{
                                    title: "Detalle de Estudiante",
                                    ...headerOptions,
                                }}
                            />

                        </Stack>
                    </ErrorBoundary>
                </AuthInitializer>
            </AuthProvider>
        </Provider>
    );
}

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import LoginForm from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {

    const router = useRouter();

    const {
        login,
        loading,
        error
    } = useAuth();

    const handleLogin = async (
        username: string,
        password: string
    ) => {

        const success = await login({
            email: username.trim(),
            password,
        });

        if (success) {
            router.replace("/home");
        }
    };

    return (
        <View style={styles.container}>
            <LoginForm
                onLogin={handleLogin}
                loading={loading}
                error={error?.message ?? ""}
            />

            <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.link}>
                    ¿No tienes cuenta? Regístrate
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    link: {
        color: "#2563EB",
        fontSize: 16,
        marginTop: 8,
    },
});

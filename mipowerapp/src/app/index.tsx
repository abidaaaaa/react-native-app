import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import LoginForm from "../components/LoginFrom";
import { GlassBackground } from "../components/glass";
import { S } from "../constants/design";
import { useLogin } from "../hooks/useLogin";

export default function LoginScreen() {

    const router = useRouter();

    const {
        login,
        loading,
        error
    } = useLogin();

    const handleLogin = async (
        email: string,
        password: string
    ) => {

        const success = await login(
            email,
            password
        );

        if (success) {
            router.replace("/home");
        }
    };

    return (
        <GlassBackground>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <LoginForm
                    onLogin={handleLogin}
                    loading={loading}
                    error={error}
                />
            </ScrollView>
        </GlassBackground>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: S.xl,
        gap: S.xl,
    },
});

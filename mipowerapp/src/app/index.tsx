import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import LoginForm from "../components/LoginFrom";
import { BLOCK, P } from "../constants/palette";
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
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >

            {/* Franja de colores */}
            <View style={styles.stripes}>
                <View style={[styles.stripe, { backgroundColor: P.lavenderStrong }]} />
                <View style={[styles.stripe, { backgroundColor: P.peachStrong }]} />
                <View style={[styles.stripe, { backgroundColor: P.mintStrong }]} />
                <View style={[styles.stripe, { backgroundColor: P.roseStrong }]} />
            </View>

            {/* Marca */}
            <View style={styles.brand}>
                <View style={styles.logo}>
                    <Text style={styles.logoText}>A</Text>
                </View>
                <View style={styles.brandLine} />
            </View>

            <LoginForm
                onLogin={handleLogin}
                loading={loading}
                error={error}
            />

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: P.bg,
    },
    content: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    stripes: {
        borderBottomWidth: 3,
        borderBottomColor: P.ink,
    },
    stripe: {
        height: 14,
    },
    brand: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        marginTop: 28,
        marginBottom: 6,
        gap: 14,
        width: "100%",
        maxWidth: 560,
        alignSelf: "center",
    },
    logo: {
        ...BLOCK,
        width: 64,
        height: 64,
        backgroundColor: P.lavender,
        alignItems: "center",
        justifyContent: "center",
    },
    logoText: { color: P.ink, fontSize: 34, fontWeight: "900" },
    brandLine: { flex: 1, height: 3, backgroundColor: P.ink },

});

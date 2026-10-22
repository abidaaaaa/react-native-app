import { View, Text, StyleSheet } from "react-native";

import ScreenLayout from "../components/ScreenLayout";
import { useAppSelector } from "../store/hooks";

export default function HomeScreen() {

    const profile = useAppSelector((state) => state.profile.data);

    const email = profile?.email ?? "";
    const firstName = profile?.nombre
        ? profile.nombre.split(" ")[0]
        : email.split("@")[0];

    return (
        <ScreenLayout
            title={`Hola, ${firstName} 👋`}
            right={<Text style={styles.icon}>👤</Text>}
        >
            <View style={styles.content}>
                <Text style={styles.title}>
                    ¡Bienvenida!
                </Text>

                <Text style={styles.subtitle}>
                    Nos alegra verte nuevamente.
                </Text>
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 26,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
    },
});

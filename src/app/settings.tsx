import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import { useRouter } from "expo-router";
import useLogout from "../hooks/useLogout";

export default function SettingsScreen() {

    const router = useRouter();
    const handleLogout = useLogout();

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => router.back()}
                >
                    <Text style={styles.back}>
                        ←
                    </Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Configuración
                </Text>

            </View>

            <View style={styles.options}>
                <Text style={styles.option}>ⓘ  Información de la app</Text>
                <Text style={styles.option}>⚙  Preferencias</Text>
                <Text style={styles.option}>🔔  Notificaciones</Text>
                <Text style={styles.option}>🔒  Privacidad</Text>
                <Text style={styles.option}>❓  Ayuda y soporte</Text>
            </View>

            <TouchableOpacity
                style={styles.logout}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>🚪  Cerrar sesión</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: "#2563EB",
    },
    back: {
        fontSize: 26,
        color: "#FFFFFF",
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    options: {
        marginTop: 20,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
    },
    option: {
        fontSize: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    logout: {
        marginTop: 30,
        marginHorizontal: 20,
        padding: 16,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
    },
    logoutText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#DC2626",
    },
});

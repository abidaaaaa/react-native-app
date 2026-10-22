import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import ScreenLayout from "../components/ScreenLayout";
import MenuItem from "../components/MenuItem";
import useLogout from "../hooks/useLogout";
import { useAppSelector } from "../store/hooks";

export default function ProfileScreen() {

    const router = useRouter();
    const logout = useLogout();
    const profile = useAppSelector((state) => state.profile.data);

    return (
        <ScreenLayout title="Mi Perfil">

            {/* INFORMACIÓN DEL USUARIO (igual que en el menú lateral) */}
            <View style={styles.userContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {(profile?.nombre ?? "").charAt(0).toUpperCase() || "?"}
                    </Text>
                </View>
                <Text style={styles.name}>{profile?.nombre ?? ""}</Text>
                <Text style={styles.email}>{profile?.email ?? ""}</Text>
            </View>

            {/* MISMOS COMPONENTES (MenuItem) QUE USA EL MENÚ DE HOME */}
            <View style={styles.options}>

                <MenuItem
                    title="Inicio"
                    icon="🏠"
                    onPress={() => router.replace("/home")}
                />

                <MenuItem
                    title="Configuración"
                    icon="⚙️"
                    onPress={() => router.push("/settings")}
                />

                <MenuItem
                    title="Cerrar sesión"
                    icon="🚪"
                    onPress={logout}
                />

            </View>

        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    userContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
        alignItems: "center",
    },
    avatar: {
        width: 75,
        height: 75,
        borderRadius: 38,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    avatarText: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "bold",
    },
    name: {
        fontSize: 19,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: "#6B7280",
    },
    options: {
        marginTop: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: "#EEEEEE",
    },
});

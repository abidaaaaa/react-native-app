import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import MenuItem from "../components/MenuItem"; // Reutilizamos tu componente MenuItem
import { BLOCK, MONO, P } from "../constants/palette";
import { RootState, logout } from "../store/store";
import { removeStorage } from "../utils/authStorage";

export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const displayName = user?.nombre
        ? `${user.nombre} ${user.apellido}`.trim()
        : user?.email ? user.email.split("@")[0] : "Alumno";

    const initial = displayName.charAt(0).toUpperCase();

    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/home");
        }
    };

    const handleLogout = async () => {
        await removeStorage("user_token");
        await removeStorage("user_info");
        await removeStorage("refresh_token");
        dispatch(logout());
        router.replace("/");
    };

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* Encabezado con botón regresar */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCopy}>
                    <Text style={styles.headerEyebrow}>CUENTA</Text>
                    <Text style={styles.headerTitle}>Mi perfil</Text>
                </View>
            </View>

            {/* Datos del Alumno: ficha */}
            <View style={styles.body}>
                <View style={styles.profile}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initial}</Text>
                    </View>
                    <View style={styles.identity}>
                        <Text style={styles.name}>{displayName}</Text>
                        <View style={styles.studentBadge}><Text style={styles.studentBadgeText}>Alumno</Text></View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.glyphCell, styles.glyphSky]}><Text style={styles.glyph}>@</Text></View>
                        <Text style={styles.email}>{user?.email || "Sin correo"}</Text>
                    </View>
                    {user?.matricula ? (
                        <View style={[styles.tableRow, styles.tableRowLast]}>
                            <View style={[styles.glyphCell, styles.glyphButter]}><Text style={styles.glyph}>#</Text></View>
                            <Text style={styles.matricula}>Matrícula: {user.matricula}</Text>
                        </View>
                    ) : null}
                </View>

                {/* Opciones con MenuItem */}
                <View style={styles.sectionHead}>
                    <Text style={styles.sectionLabel}>Tu espacio</Text>
                    <View style={styles.sectionRule} />
                </View>
                <View style={styles.options}>
                    <MenuItem
                        title="Inicio"
                        icon="🏠"
                        onPress={() => router.replace("/home")}
                    />

                    <MenuItem
                        title="Mi Perfil"
                        icon="👤"
                        onPress={() => {}} // Ya estamos en Perfil
                    />

                    <MenuItem
                        title="Configuración"
                        icon="⚙️"
                        onPress={() => router.push("/settings")}
                    />
                </View>

                <View style={styles.spacer} />

                {/* Cerrar sesión */}
                <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                    <Text style={styles.logoutIcon}>🚪</Text>
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: P.bg },
    container: { flexGrow: 1, paddingBottom: 30 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingTop: 46,
        paddingBottom: 18,
        paddingHorizontal: 20,
        backgroundColor: P.rose,
        borderBottomWidth: 3,
        borderBottomColor: P.ink,
    },
    backButton: {
        width: 44, height: 44, backgroundColor: P.paper,
        borderWidth: 2, borderColor: P.ink, borderRightWidth: 4, borderBottomWidth: 4,
        alignItems: "center", justifyContent: "center",
    },
    back: { fontSize: 20, color: P.ink, fontWeight: "900" },
    headerCopy: {},
    headerEyebrow: { color: P.roseInk, fontFamily: MONO, fontSize: 11, fontWeight: "700", letterSpacing: 3, marginBottom: 2 },
    headerTitle: { fontSize: 28, fontWeight: "900", color: P.ink, textTransform: "uppercase", letterSpacing: -0.5 },

    body: { flex: 1, padding: 20 },
    profile: { ...BLOCK, flexDirection: "row", alignItems: "stretch", backgroundColor: P.paper },
    avatar: {
        width: 108, backgroundColor: P.lavenderStrong,
        alignItems: "center", justifyContent: "center",
        borderRightWidth: 2, borderRightColor: P.ink,
    },
    avatarText: { fontSize: 52, fontWeight: "900", color: P.ink },
    identity: { flex: 1, padding: 16, justifyContent: "center" },
    name: { fontSize: 20, fontWeight: "900", color: P.ink, textTransform: "uppercase", marginBottom: 10 },
    studentBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, backgroundColor: P.mintStrong, borderWidth: 2, borderColor: P.ink },
    studentBadgeText: { fontFamily: MONO, fontSize: 11, fontWeight: "700", color: P.ink, letterSpacing: 1 },

    table: { marginTop: 18, borderWidth: 2, borderColor: P.ink, backgroundColor: P.paper },
    tableRow: { flexDirection: "row", alignItems: "stretch", borderBottomWidth: 2, borderBottomColor: P.ink },
    tableRowLast: { borderBottomWidth: 0 },
    glyphCell: { width: 48, alignItems: "center", justifyContent: "center", borderRightWidth: 2, borderRightColor: P.ink },
    glyphSky: { backgroundColor: P.lavender },
    glyphButter: { backgroundColor: P.peach },
    glyph: { fontFamily: MONO, fontSize: 18, fontWeight: "900", color: P.ink },
    email: { flex: 1, padding: 14, fontFamily: MONO, fontSize: 13, color: P.ink },
    matricula: { flex: 1, padding: 14, fontFamily: MONO, fontSize: 13, color: P.ink },

    sectionHead: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 30, marginBottom: 2 },
    sectionLabel: { color: P.ink, fontFamily: MONO, fontSize: 12, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase" },
    sectionRule: { flex: 1, height: 3, backgroundColor: P.ink },
    options: {},
    spacer: { flex: 1, minHeight: 24 },
    logout: {
        ...BLOCK,
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
        paddingVertical: 16, backgroundColor: P.rose,
    },
    logoutIcon: { fontSize: 18 },
    logoutText: { fontSize: 13, color: P.roseInk, fontWeight: "900", letterSpacing: 1.5, textTransform: "uppercase" },
});

import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import MenuItem from "../components/MenuItem"; // Reutilizamos tu componente MenuItem
import { GlassBackground, GlassButton, GlassCard, GlassHeader } from "../components/glass";
import { G, R, S, T, glass } from "../constants/design";
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
        <GlassBackground>
            {/* Encabezado con botón regresar */}
            <GlassHeader
                eyebrow="CUENTA"
                title="Mi perfil"
                left={{ icon: "←", label: "Regresar", onPress: handleGoBack }}
            />

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Datos del Alumno: ficha */}
                <GlassCard style={styles.profile}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initial}</Text>
                    </View>
                    <View style={styles.identity}>
                        <Text style={styles.name} numberOfLines={2}>{displayName}</Text>
                        <View style={glass.chip}>
                            <Text style={styles.studentBadgeText}>Alumno</Text>
                        </View>
                    </View>
                </GlassCard>

                <GlassCard>
                    <View style={[styles.tableRow, user?.matricula ? styles.tableRowDivider : null]}>
                        <View style={styles.glyphCell}><Text style={styles.glyph}>@</Text></View>
                        <Text style={styles.info}>{user?.email || "Sin correo"}</Text>
                    </View>
                    {user?.matricula ? (
                        <View style={styles.tableRow}>
                            <View style={styles.glyphCell}><Text style={styles.glyph}>#</Text></View>
                            <Text style={styles.info}>Matrícula: {user.matricula}</Text>
                        </View>
                    ) : null}
                </GlassCard>

                {/* Opciones con MenuItem */}
                <Text style={styles.sectionLabel}>Tu espacio</Text>
                <View>
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
                <GlassButton title="Cerrar sesión" variant="danger" onPress={handleLogout} />
            </ScrollView>
        </GlassBackground>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: S.lg, paddingBottom: S.xxl, gap: S.md },
    profile: { flexDirection: "row", alignItems: "center", gap: S.lg, padding: S.lg },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: R.lg,
        backgroundColor: G.accentSoft,
        borderWidth: 1,
        borderColor: G.border,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: { fontSize: 38, fontWeight: "800", color: G.text },
    identity: { flex: 1, minWidth: 0, gap: S.sm },
    name: { ...T.title, fontSize: 22, lineHeight: 28 },
    studentBadgeText: { fontSize: 12, fontWeight: "700", color: G.accent },

    tableRow: { flexDirection: "row", alignItems: "center", gap: S.md, padding: S.md },
    tableRowDivider: { borderBottomWidth: 1, borderBottomColor: G.divider },
    glyphCell: {
        width: 40,
        height: 40,
        borderRadius: R.sm,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: G.violetSoft,
    },
    glyph: { fontSize: 18, fontWeight: "800", color: G.text },
    info: { ...T.body, flex: 1, minWidth: 0 },

    sectionLabel: { ...T.label, textTransform: "uppercase", letterSpacing: 1.6, marginTop: S.md, marginLeft: S.xs },
    spacer: { flexGrow: 1, minHeight: S.lg },
});

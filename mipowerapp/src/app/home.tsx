import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import SideMenu from "../components/SideMenu";
import { GlassBackground, GlassCard, GlassHeader } from "../components/glass";
import { G, R, S, T, glass } from "../constants/design";
import { RootState, logout } from "../store/store";
import { removeStorage } from "../utils/authStorage";

/* Fila de acceso rápido (icono + texto + flecha) */
function QuickRow({
    icon,
    tint,
    index,
    title,
    text,
    onPress,
}: {
    icon: string;
    tint: string;
    index: string;
    title: string;
    text: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            style={styles.row}
            onPress={onPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={title}
        >
            <View style={[styles.iconCell, { backgroundColor: tint }]}>
                <Text style={styles.iconText}>{icon}</Text>
            </View>
            <View style={styles.copy}>
                <Text style={styles.index}>{index}</Text>
                <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
                <Text style={styles.rowText}>{text}</Text>
            </View>
            <Text style={styles.arrowText}>↗</Text>
        </TouchableOpacity>
    );
}

export default function HomeScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);

    // Leer usuario dinámico desde Redux
    const user = useSelector((state: RootState) => state.auth.user);

    // Nombre para mostrar en el saludo
    const firstName = user?.nombre
        ? user.nombre

        : user?.email ? user.email.split("@")[0] : "Usuario";

    const handleLogout = async () => {
        setMenuOpen(false);
        await removeStorage("user_token");
        await removeStorage("user_info");
        await removeStorage("refresh_token");
        dispatch(logout());
        router.replace("/");
    };

    return (
        <GlassBackground>
            {/* Barra superior */}
            <GlassHeader
                eyebrow="PORTAL DEL ALUMNO"
                title="Inicio"
                left={{ icon: "☰", label: "Abrir menú", onPress: () => setMenuOpen(true) }}
                right={{ icon: "👤", label: "Ir a mi perfil", onPress: () => router.push("/profile") }}
            />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Encabezado */}
                <View style={styles.hero}>
                    {/* Saludo dinámico con el nombre del estado global */}
                    <View style={glass.chip}>
                        <Text style={styles.greeting}>Hola, {firstName} 👋</Text>
                    </View>
                    <Text style={styles.title}>Qué gusto verte, {firstName}</Text>
                    <Text style={styles.subtitle}>Tu vida escolar, en un solo lugar.</Text>
                </View>

                <Text style={styles.sectionTitle}>Accesos rápidos</Text>

                <QuickRow
                    icon="🎓"
                    tint={G.accentSoft}
                    index="01"
                    title="Estudiantes"
                    text="Consulta y administra el alumnado"
                    onPress={() => router.push("/students")}
                />
                <QuickRow
                    icon="◉"
                    tint={G.violetSoft}
                    index="02"
                    title="Mi perfil"
                    text="Consulta tus datos"
                    onPress={() => router.push("/profile")}
                />
                <QuickRow
                    icon="⚙"
                    tint={G.cyanSoft}
                    index="03"
                    title="Ajustes"
                    text="Personaliza tu espacio"
                    onPress={() => router.push("/settings")}
                />

                <GlassCard style={styles.noteCard}>
                    <View style={styles.noteDot} />
                    <View style={styles.noteTextWrap}>
                        <Text style={styles.noteTitle}>Todo listo para comenzar</Text>
                        <Text style={styles.noteDescription}>Explora tus opciones desde el menú y mantén tu información al día.</Text>
                    </View>
                </GlassCard>
            </ScrollView>

            <SideMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}
                onProfile={() => {
                    setMenuOpen(false);
                    router.push("/profile");
                }}
                onSettings={() => {
                    setMenuOpen(false);
                    router.push("/settings");
                }}
                onLogout={handleLogout}
            />
        </GlassBackground>
    );
}

const styles = StyleSheet.create({
    content: { padding: S.lg, paddingBottom: S.xxl, gap: S.md },
    hero: { gap: S.sm, marginTop: S.sm, marginBottom: S.lg },
    greeting: { fontSize: 12, fontWeight: "700", letterSpacing: 0.6, color: G.accent },
    title: { ...T.title, fontSize: 30, lineHeight: 36, marginTop: S.xs },
    subtitle: { ...T.body, color: G.textSoft },

    sectionTitle: { ...T.label, textTransform: "uppercase", letterSpacing: 1.6, marginLeft: S.xs },

    row: { ...glass.card, flexDirection: "row", alignItems: "center", gap: S.md, padding: S.md },
    iconCell: {
        width: 56,
        height: 56,
        borderRadius: R.md,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: G.borderSoft,
    },
    iconText: { fontSize: 26, color: G.text },
    copy: { flex: 1, minWidth: 0, gap: 2 },
    index: { ...T.label, fontSize: 11, color: G.textMute },
    rowTitle: { ...T.heading, fontSize: 17 },
    rowText: { ...T.caption },
    arrowText: { color: G.accentEnd, fontSize: 20, fontWeight: "800" },

    noteCard: { flexDirection: "row", alignItems: "flex-start", gap: S.md, padding: S.lg, marginTop: S.sm },
    noteDot: { width: 10, height: 10, borderRadius: 3, backgroundColor: G.accentEnd, marginTop: 5 },
    noteTextWrap: { flex: 1, minWidth: 0, gap: S.xs },
    noteTitle: { ...T.heading, fontSize: 15, lineHeight: 20 },
    noteDescription: { ...T.caption },
});

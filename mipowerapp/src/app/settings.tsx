import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import { GlassBackground, GlassButton, GlassCard, GlassHeader } from "../components/glass";
import { G, R, S, T } from "../constants/design";
import { logout } from "../store/store";
import { removeStorage } from "../utils/authStorage";

/* Opción de la lista (solo visual) */
function Option({
    icon,
    text,
    tint,
    last = false,
}: {
    icon: string;
    text: string;
    tint: string;
    last?: boolean;
}) {
    return (
        <View style={[styles.option, !last && styles.optionDivider]}>
            <View style={[styles.optionIconBox, { backgroundColor: tint }]}>
                <Text style={styles.optionIcon}>{icon}</Text>
            </View>
            <Text style={styles.optionText} numberOfLines={1}>{text}</Text>
            <Text style={styles.optionArrow}>→</Text>
        </View>
    );
}

export default function SettingsScreen() {

    const router = useRouter();
    const dispatch = useDispatch();

    // Igual que en home y perfil: borra la sesión guardada y limpia Redux
    const handleLogout = async () => {
        await removeStorage("user_token");
        await removeStorage("user_info");
        await removeStorage("refresh_token");
        dispatch(logout());
        router.replace("/");
    };

    return (
        <GlassBackground>

            <GlassHeader
                eyebrow="TU CUENTA"
                title="Configuración"
                left={{ icon: "←", label: "Regresar", onPress: () => router.back() }}
            />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <Text style={styles.sectionLabel}>Preferencias</Text>

                <GlassCard>
                    <Option icon="ⓘ" text="Información de la app" tint={G.accentSoft} />
                    <Option icon="⚙" text="Preferencias" tint={G.violetSoft} />
                    <Option icon="♧" text="Notificaciones" tint={G.cyanSoft} />
                    <Option icon="▣" text="Privacidad" tint={G.accentSoft} />
                    <Option icon="?" text="Ayuda y soporte" tint={G.violetSoft} last />
                </GlassCard>

                <GlassButton
                    title="Cerrar sesión"
                    variant="danger"
                    onPress={handleLogout}
                    style={styles.logout}
                />

            </ScrollView>

        </GlassBackground>
    );
}

const styles = StyleSheet.create({
    content: { padding: S.lg, paddingBottom: S.xxl, gap: S.md },
    sectionLabel: { ...T.label, textTransform: "uppercase", letterSpacing: 1.6, marginLeft: S.xs },
    option: {
        minHeight: 62,
        flexDirection: "row",
        alignItems: "center",
        gap: S.md,
        paddingHorizontal: S.md,
        paddingVertical: S.sm,
    },
    optionDivider: { borderBottomWidth: 1, borderBottomColor: G.divider },
    optionIconBox: {
        width: 40,
        height: 40,
        borderRadius: R.sm,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: G.borderSoft,
    },
    optionIcon: { color: G.text, fontSize: 18, fontWeight: "800" },
    optionText: { ...T.body, flex: 1, minWidth: 0, fontWeight: "700" },
    optionArrow: { color: G.accentEnd, fontSize: 18, fontWeight: "700" },
    logout: { marginTop: S.lg },
});
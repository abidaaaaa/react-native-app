import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { G, R, S, T } from "../constants/design";
import { SideMenuProps } from "../interfaces/menu.interface";
import { RootState } from "../store/store";
import { GlassButton } from "./glass";
import MenuItem from "./MenuItem";

export default function SideMenu({
    visible,
    onClose,
    onProfile,
    onSettings,
    onLogout
}: SideMenuProps) {

    // Obtener usuario del estado global de Redux
    const user = useSelector((state: RootState) => state.auth.user);
    const insets = useSafeAreaInsets();

    if (!visible) {
        return null;
    }

    // Calcular el nombre completo o email por defecto
    const displayName = user?.nombre
        ? `${user.nombre} ${user.apellido}`.trim()
        : user?.email ? user.email.split("@")[0] : "Alumno";

    const initial = displayName.charAt(0).toUpperCase();

    return (
        <View style={styles.overlay}>

            {/* FONDO (cierra al tocar) */}
            <TouchableOpacity
                style={styles.background}
                onPress={onClose}
                activeOpacity={1}
                accessibilityRole="button"
                accessibilityLabel="Cerrar menú"
            />

            {/* MENÚ LATERAL DERECHO */}
            <View style={styles.menu}>

                {/* INFORMACIÓN DEL USUARIO */}
                <View style={[styles.userContainer, { paddingTop: insets.top + S.xl }]}>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {initial}
                        </Text>
                    </View>

                    <Text style={styles.name} numberOfLines={2}>
                        {displayName}
                    </Text>

                    <Text style={styles.email} numberOfLines={1}>
                        {user?.email || "Sin correo"}
                    </Text>

                </View>

                <ScrollView
                    style={styles.listScroll}
                    contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + S.xl }]}
                    showsVerticalScrollIndicator={false}
                >

                    {/* OPCIÓN INICIO */}
                    <Text style={styles.menuSection}>MENÚ</Text>
                    <MenuItem
                        title="Inicio"
                        icon="🏠"
                        onPress={onClose}
                    />

                    {/* OPCIÓN PERFIL */}
                    <MenuItem
                        title="Mi Perfil"
                        icon="👤"
                        onPress={onProfile}
                    />

                    {/* OPCIÓN CONFIGURACIÓN */}
                    <MenuItem
                        title="Configuración"
                        icon="⚙️"
                        onPress={onSettings}
                    />

                    {/* ESPACIO */}
                    <View style={styles.spacer} />

                    {/* CERRAR SESIÓN */}
                    <GlassButton
                        title="Cerrar sesión"
                        variant="danger"
                        onPress={onLogout}
                    />

                </ScrollView>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        zIndex: 1000,
    },
    background: {
        flex: 1,
        backgroundColor: "rgba(3, 5, 14, 0.65)",
    },
    menu: {
        width: "80%",
        maxWidth: 360,
        height: "100%",
        backgroundColor: G.bgRaised,
        borderLeftWidth: 1,
        borderLeftColor: G.border,
    },
    userContainer: {
        paddingBottom: S.xl,
        paddingHorizontal: S.xl,
        backgroundColor: G.glass,
        borderBottomWidth: 1,
        borderBottomColor: G.border,
        gap: S.xs,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: R.lg,
        backgroundColor: G.accentSoft,
        borderWidth: 1,
        borderColor: G.border,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: S.md,
    },
    avatarText: {
        color: G.text,
        fontSize: 28,
        fontWeight: "800",
    },
    name: {
        ...T.heading,
    },
    email: {
        ...T.caption,
    },
    listScroll: {
        flex: 1,
    },
    list: {
        flexGrow: 1,
        paddingHorizontal: S.xl,
        paddingTop: S.xl,
    },
    menuSection: {
        ...T.label,
        color: G.textMute,
        letterSpacing: 2,
        marginBottom: S.sm,
    },
    spacer: {
        flexGrow: 1,
        minHeight: S.xl,
    },
});

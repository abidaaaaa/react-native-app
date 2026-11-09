import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSelector } from "react-redux";

import { BLOCK, MONO, P } from "../constants/palette";
import { SideMenuProps } from "../interfaces/menu.interface";
import { RootState } from "../store/store";
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
            />

            {/* MENÚ LATERAL DERECHO */}
            <View style={styles.menu}>

                {/* INFORMACIÓN DEL USUARIO */}
                <View style={styles.userContainer}>

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

                <View style={styles.list}>

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
                    <TouchableOpacity
                        style={styles.logout}
                        onPress={onLogout}
                    >

                        <Text style={styles.logoutIcon}>
                            🚪
                        </Text>

                        <Text style={styles.logoutText}>
                            Cerrar sesión
                        </Text>

                    </TouchableOpacity>

                </View>

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
        backgroundColor: "rgba(63, 53, 86, 0.45)",
    },
    menu: {
        width: "80%",
        maxWidth: 360,
        height: "100%",
        backgroundColor: P.bg,
        borderLeftWidth: 4,
        borderLeftColor: P.ink,
    },
    userContainer: {
        paddingTop: 58,
        paddingBottom: 22,
        paddingHorizontal: 20,
        backgroundColor: P.peach,
        borderBottomWidth: 4,
        borderBottomColor: P.ink,
    },
    avatar: {
        ...BLOCK,
        width: 70,
        height: 70,
        backgroundColor: P.lavenderStrong,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    avatarText: {
        color: P.ink,
        fontSize: 32,
        fontWeight: "900",
    },
    name: {
        fontSize: 20,
        fontWeight: "900",
        textTransform: "uppercase",
        color: P.ink,
        marginBottom: 4,
    },
    email: {
        fontFamily: MONO,
        fontSize: 12,
        color: P.inkSoft,
    },
    list: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 24,
    },
    menuSection: {
        color: P.inkMute,
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 3,
        marginBottom: 4,
    },
    spacer: {
        flex: 1,
    },
    logout: {
        ...BLOCK,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 15,
        backgroundColor: P.rose,
    },
    logoutIcon: {
        fontSize: 18,
    },
    logoutText: {
        fontSize: 13,
        color: P.roseInk,
        fontWeight: "900",
        letterSpacing: 1.5,
        textTransform: "uppercase",
    },
});

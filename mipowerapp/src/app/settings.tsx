import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { useRouter } from "expo-router";

import { BLOCK, MONO, P } from "../constants/palette";

export default function SettingsScreen() {

    const router = useRouter();

    const handleLogout = () => {
        router.replace("/");
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.back}>
                        ←
                    </Text>
                </TouchableOpacity>

                <View style={styles.headerCopy}>
                    <Text style={styles.headerEyebrow}>TU CUENTA</Text>
                    <Text style={styles.headerTitle}>Configuración</Text>
                </View>
                <View style={styles.headerBalance} />

            </View>

            <View style={styles.sectionHead}>
                <Text style={styles.sectionLabel}>Preferencias</Text>
                <View style={styles.sectionRule} />
            </View>

            <View style={styles.options}>
                <View style={[styles.option, styles.rowLavender]}><Text style={styles.optionIcon}>ⓘ</Text><Text style={styles.optionText}>Información de la app</Text><Text style={styles.optionArrow}>→</Text></View>
                <View style={[styles.option, styles.rowPeach]}><Text style={styles.optionIcon}>⚙</Text><Text style={styles.optionText}>Preferencias</Text><Text style={styles.optionArrow}>→</Text></View>
                <View style={[styles.option, styles.rowMint]}><Text style={styles.optionIcon}>♧</Text><Text style={styles.optionText}>Notificaciones</Text><Text style={styles.optionArrow}>→</Text></View>
                <View style={[styles.option, styles.rowRose]}><Text style={styles.optionIcon}>▣</Text><Text style={styles.optionText}>Privacidad</Text><Text style={styles.optionArrow}>→</Text></View>
                <View style={[styles.option, styles.lastOption, styles.rowLavender]}><Text style={styles.optionIcon}>?</Text><Text style={styles.optionText}>Ayuda y soporte</Text><Text style={styles.optionArrow}>→</Text></View>
            </View>

            <TouchableOpacity
                style={styles.logout}
                onPress={handleLogout}
            >
                <Text style={styles.logoutIcon}>↪</Text>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: P.bg },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 46,
        paddingBottom: 18,
        gap: 16,
        backgroundColor: P.mint,
        borderBottomWidth: 3,
        borderBottomColor: P.ink,
    },
    backButton: {
        width: 44, height: 44, backgroundColor: P.paper,
        borderWidth: 2, borderColor: P.ink, borderRightWidth: 4, borderBottomWidth: 4,
        alignItems: "center", justifyContent: "center",
    },
    back: { fontSize: 20, color: P.ink, fontWeight: "900" },
    headerCopy: { flex: 1 },
    headerEyebrow: { color: P.mintInk, fontFamily: MONO, fontSize: 11, fontWeight: "700", letterSpacing: 3, marginBottom: 2 },
    headerBalance: { width: 4 },
    headerTitle: { fontSize: 26, fontWeight: "900", color: P.ink, textTransform: "uppercase", letterSpacing: -0.5 },
    sectionHead: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 28, marginBottom: 16, marginHorizontal: 20 },
    sectionLabel: { color: P.ink, fontFamily: MONO, fontSize: 12, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase" },
    sectionRule: { flex: 1, height: 3, backgroundColor: P.ink },
    options: {
        ...BLOCK,
        marginHorizontal: 20,
        backgroundColor: P.paper,
    },
    option: {
        minHeight: 62,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 2,
        borderBottomColor: P.ink,
    },
    lastOption: { borderBottomWidth: 0 },
    rowLavender: { backgroundColor: P.lavender },
    rowPeach: { backgroundColor: P.peach },
    rowMint: { backgroundColor: P.mint },
    rowRose: { backgroundColor: P.rose },
    optionIcon: { width: 30, textAlign: "center", color: P.ink, fontSize: 20, fontWeight: "900" },
    optionText: { flex: 1, color: P.ink, fontSize: 13, fontWeight: "900", letterSpacing: 1, textTransform: "uppercase" },
    optionArrow: { color: P.ink, fontFamily: MONO, fontSize: 18, fontWeight: "700" },
    logout: {
        ...BLOCK,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: P.roseStrong,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 26,
    },
    logoutIcon: { color: P.ink, fontSize: 18, fontWeight: "900" },
    logoutText: { color: P.ink, fontSize: 13, fontWeight: "900", letterSpacing: 1.5, textTransform: "uppercase" },
});

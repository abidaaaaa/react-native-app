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
import { BLOCK, MONO, P } from "../constants/palette";
import { RootState, logout } from "../store/store";
import { removeStorage } from "../utils/authStorage";

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
        <View style={styles.container}>
            {/* Barra superior */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.squareButton} onPress={() => setMenuOpen(true)}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>

                <Text style={styles.eyebrow}>PORTAL DEL ALUMNO</Text>

                <TouchableOpacity style={styles.squareButton} onPress={() => router.push("/profile")}>
                    <Text style={styles.profile}>👤</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Encabezado editorial */}
                <View style={styles.hero}>
                    {/* Saludo dinámico con el nombre del estado global */}
                    <View style={styles.greetingTag}>
                        <Text style={styles.greeting}>Hola, {firstName} 👋</Text>
                    </View>
                    <Text style={styles.title}>Qué gusto verte, {firstName}</Text>
                    <Text style={styles.subtitle}>Tu vida escolar, en un solo lugar.</Text>
                </View>

                <View style={styles.sectionHead}>
                    <Text style={styles.sectionTitle}>Accesos rápidos</Text>
                    <View style={styles.sectionRule} />
                </View>

                {/* Lista numerada */}
                <TouchableOpacity style={styles.row} onPress={() => router.push("/students")}>
                    <View style={[styles.iconCell, styles.cellPeach]}><Text style={styles.studentsIconText}>🎓</Text></View>
                    <View style={styles.copy}>
                        <Text style={styles.index}>01</Text>
                        <Text style={styles.rowTitle}>Estudiantes</Text>
                        <Text style={styles.rowText}>Consulta y administra el alumnado</Text>
                    </View>
                    <View style={styles.arrowCell}><Text style={styles.arrowText}>↗</Text></View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.row} onPress={() => router.push("/profile")}>
                    <View style={[styles.iconCell, styles.cellRose]}><Text style={styles.quickIconText}>◉</Text></View>
                    <View style={styles.copy}>
                        <Text style={styles.index}>02</Text>
                        <Text style={styles.rowTitle}>Mi perfil</Text>
                        <Text style={styles.rowText}>Consulta tus datos</Text>
                    </View>
                    <View style={styles.arrowCell}><Text style={styles.arrowText}>↗</Text></View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.row} onPress={() => router.push("/settings")}>
                    <View style={[styles.iconCell, styles.cellMint]}><Text style={styles.quickIconText}>⚙</Text></View>
                    <View style={styles.copy}>
                        <Text style={styles.index}>03</Text>
                        <Text style={styles.rowTitle}>Ajustes</Text>
                        <Text style={styles.rowText}>Personaliza tu espacio</Text>
                    </View>
                    <View style={styles.arrowCell}><Text style={styles.arrowText}>↗</Text></View>
                </TouchableOpacity>

                <View style={styles.noteCard}>
                    <View style={styles.noteDot} />
                    <View style={styles.noteTextWrap}>
                        <Text style={styles.noteTitle}>Todo listo para comenzar</Text>
                        <Text style={styles.noteDescription}>Explora tus opciones desde el menú y mantén tu información al día.</Text>
                    </View>
                </View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: P.bg },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 46,
        paddingBottom: 14,
        paddingHorizontal: 20,
        backgroundColor: P.lavender,
        borderBottomWidth: 3,
        borderBottomColor: P.ink,
    },
    squareButton: {
        width: 44,
        height: 44,
        backgroundColor: P.paper,
        borderWidth: 2,
        borderColor: P.ink,
        borderRightWidth: 4,
        borderBottomWidth: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    menuIcon: { fontSize: 20, color: P.ink, fontWeight: "900" },
    profile: { fontSize: 20 },
    eyebrow: { color: P.ink, fontFamily: MONO, fontSize: 11, fontWeight: "700", letterSpacing: 2 },

    content: { padding: 20, paddingBottom: 40 },
    hero: { borderLeftWidth: 10, borderLeftColor: P.peachStrong, paddingLeft: 16, marginTop: 8, marginBottom: 30 },
    greetingTag: { alignSelf: "flex-start", backgroundColor: P.mint, borderWidth: 2, borderColor: P.ink, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 14 },
    greeting: { fontFamily: MONO, fontSize: 12, fontWeight: "700", color: P.ink },
    title: { fontSize: 36, lineHeight: 40, fontWeight: "900", color: P.ink, textTransform: "uppercase", letterSpacing: -0.5 },
    subtitle: { fontSize: 15, color: P.inkSoft, marginTop: 12 },

    sectionHead: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 },
    sectionTitle: { fontFamily: MONO, fontSize: 12, fontWeight: "700", letterSpacing: 2, color: P.ink, textTransform: "uppercase" },
    sectionRule: { flex: 1, height: 3, backgroundColor: P.ink },

    row: { ...BLOCK, flexDirection: "row", alignItems: "stretch", backgroundColor: P.paper, marginBottom: 16 },
    iconCell: { width: 76, alignItems: "center", justifyContent: "center", borderRightWidth: 2, borderRightColor: P.ink },
    cellPeach: { backgroundColor: P.peachStrong },
    cellRose: { backgroundColor: P.roseStrong },
    cellMint: { backgroundColor: P.mintStrong },
    studentsIconText: { fontSize: 30 },
    quickIconText: { fontSize: 30, color: P.ink },
    copy: { flex: 1, paddingVertical: 14, paddingHorizontal: 14 },
    index: { fontFamily: MONO, fontSize: 11, color: P.inkMute, marginBottom: 4 },
    rowTitle: { fontSize: 18, fontWeight: "900", color: P.ink, textTransform: "uppercase", letterSpacing: 0.5 },
    rowText: { fontSize: 12, lineHeight: 17, color: P.inkSoft, marginTop: 4 },
    arrowCell: { width: 44, alignItems: "center", justifyContent: "center", backgroundColor: P.ink },
    arrowText: { color: P.bg, fontSize: 18, fontWeight: "900" },

    noteCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16, marginTop: 6, backgroundColor: P.lavender, borderWidth: 2, borderColor: P.ink, borderStyle: "dashed" },
    noteDot: { width: 12, height: 12, backgroundColor: P.ink, marginTop: 4 },
    noteTextWrap: { flex: 1 },
    noteTitle: { color: P.ink, fontSize: 13, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
    noteDescription: { color: P.inkSoft, fontSize: 12, lineHeight: 18 },
});

import { ReactNode, useState } from "react";
import { View, StyleSheet } from "react-native";
import { usePathname, useRouter } from "expo-router";

import Header from "./Header";
import SideMenu from "./SideMenu";
import useLogout from "../hooks/useLogout";
import { useAppSelector } from "../store/hooks";

interface ScreenLayoutProps {
    title: string;
    right?: ReactNode;
    onBack?: () => void;
    children: ReactNode;
}

type AppPath = "/home" | "/profile" | "/settings";

// Estructura reutilizable de las pantallas: encabezado + menú lateral + contenido
export default function ScreenLayout({
    title,
    right,
    onBack,
    children
}: ScreenLayoutProps) {

    const router = useRouter();
    const pathname = usePathname();
    const logout = useLogout();
    const profile = useAppSelector((state) => state.profile.data);

    const [menuOpen, setMenuOpen] = useState(false);

    const email = profile?.email ?? "";
    // Si la cuenta no tiene nombre (usuario registrado), se muestra el correo
    const name = profile?.nombre || email;

    const goTo = (path: AppPath) => {
        setMenuOpen(false);
        if (pathname === path) return; // ya estás en esa pantalla

        if (path === "/home") {
            router.replace(path);
        } else {
            router.push(path);
        }
    };

    return (
        <View style={styles.container}>

            <Header
                title={title}
                right={right}
                onBack={onBack}
                onMenuPress={() => setMenuOpen(true)}
            />

            <View style={styles.body}>
                {children}
            </View>

            <SideMenu
                visible={menuOpen}
                name={name}
                email={email}
                onClose={() => setMenuOpen(false)}
                onHome={() => goTo("/home")}
                onProfile={() => goTo("/profile")}
                onSettings={() => goTo("/settings")}
                onLogout={() => {
                    setMenuOpen(false);
                    logout();
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    body: {
        flex: 1,
    },
});

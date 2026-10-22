import { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface HeaderProps {
    title: string;
    onMenuPress: () => void;
    onBack?: () => void;   // si se pasa, aparece la flecha ← junto al menú ☰
    right?: ReactNode;
}

// Encabezado reutilizable: (← opcional) + ☰ + título + espacio opcional a la derecha
export default function Header({
    title,
    onMenuPress,
    onBack,
    right
}: HeaderProps) {

    const sideWidth = onBack ? 72 : 32;

    return (
        <View style={styles.header}>

            <View style={[styles.left, { width: sideWidth }]}>
                {onBack && (
                    <TouchableOpacity onPress={onBack}>
                        <Text style={[styles.icon, styles.backIcon]}>←</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onMenuPress}>
                    <Text style={styles.icon}>☰</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>{title}</Text>

            <View style={[styles.right, { width: sideWidth }]}>{right}</View>

        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: "#2563EB",
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        fontSize: 26,
        color: "#FFFFFF",
    },
    backIcon: {
        marginRight: 14,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF",
        textAlign: "center",
    },
    right: {
        alignItems: "flex-end",
    },
});

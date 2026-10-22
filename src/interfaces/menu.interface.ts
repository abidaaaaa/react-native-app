export interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
    onHome: () => void;
    onProfile: () => void;
    onSettings: () => void;
    onLogout: () => void;
    name: string;
    email: string;
}

export interface MenuItemProps {
    title: string;
    icon: string;
    onPress: () => void;
}

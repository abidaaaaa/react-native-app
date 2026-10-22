import { useRouter } from "expo-router";
import { useAuth } from "./useAuth";

export default function useLogout() {
    const router = useRouter();
    const { logout } = useAuth();

    return async () => {
        await logout();       // revoca el token, lo borra del dispositivo y vacía el perfil
        router.replace("/");
    };
}

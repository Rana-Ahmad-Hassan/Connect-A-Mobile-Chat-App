
import { useAuthContext } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export const useLogout = () => {
    const { setAuthUser } = useAuthContext();
    const router = useRouter();

    const logout = async () => {
        try {
            setAuthUser(null);
            await AsyncStorage.removeItem("chat-user");
            router.push("/");
        } catch (error: any) {
            console.error(error);
        }
    };

    return { logout };
}
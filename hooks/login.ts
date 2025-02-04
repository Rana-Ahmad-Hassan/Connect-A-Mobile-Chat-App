import { useState } from "react";
import { api } from "@/api/api";
import { useAuthContext } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const useLogin = () => {
  const { setAuthUser } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ( email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/v1/auth/signIn", { email, password });
      await AsyncStorage.setItem("chat-user", JSON.stringify(response.data));
      setAuthUser(response.data);
      return response.data;
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to register");
      throw new Error(error.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

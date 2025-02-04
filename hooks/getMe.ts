import { useState } from "react";
import { api } from "@/api/api";
import { useAuthContext } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";



export const useValidateUser = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const validateUser = async (token: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/api/v1/auth/getMe",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to validate");
            throw new Error(error.response?.data?.message || "Failed to register");
        } finally {
            setLoading(false); // Set loading to false after the request completes
        }
    };

    return { validateUser, loading, error };
};

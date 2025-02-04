import { useState } from "react";
import { api } from "@/api/api";
import { useAuthContext } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";



export const useGetConversations = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getConversations = async (token: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/api/v1/messages/allConversations",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to fetch Conversations");
            throw new Error(error.response?.data?.message || "Failed to fetch Conversations");
        } finally {
            setLoading(false);
        }
    };

    return { getConversations, loading, error };
};

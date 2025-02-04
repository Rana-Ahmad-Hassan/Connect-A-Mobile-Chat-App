import { useState } from "react";
import { api } from "@/api/api";
import { useAuthContext } from "@/context/authContext";

export const useSendMessage = () => {
    const { authUser } = useAuthContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (message: string, id: string, token:any) => {
        if (!token) {
            setError("User not authenticated");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.post(
                `/api/v1/messages/send/${id}`,
                { message },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to send message";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading, error };
};

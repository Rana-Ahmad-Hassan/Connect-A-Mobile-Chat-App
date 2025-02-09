import { useState } from "react";
import { api } from "@/api/api";

export const useCreateConversation = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createConversation = async (id: string, token: string) => {
        if (!token) {
            setError("User not authenticated");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.post(
                `/api/v1/messages/create/${id}`, 
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json", 
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to create conversation";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { createConversation, loading, error };
};

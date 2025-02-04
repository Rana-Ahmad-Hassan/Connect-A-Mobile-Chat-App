import { useState } from "react";
import { api } from "@/api/api";




export const useGetMessages = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getMessages = async (id: string, token: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/api/v1/messages/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to fetchMessages");
            throw new Error(error.response?.data?.message || "Failed to FetchMessages");
        } finally {
            setLoading(false);
        }
    };

    return { getMessages, loading, error };
};

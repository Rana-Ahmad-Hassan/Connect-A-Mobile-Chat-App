import { useState } from "react";
import { api } from "@/api/api";




export const useGetStatusFeed = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getStatusFeed = async (token: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/api/v1/status/status-feed",
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
            setLoading(false);
        }
    };

    return { getStatusFeed, loading, error };
};

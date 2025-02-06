import { useState } from "react";
import { api } from "@/api/api";




export const useGetLoggedInUserStatuses = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getStatus = async (token: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/api/v1/status/user-status",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to fetch user status");
            throw new Error(error.response?.data?.message || "Failed to fetch statuses");
        } finally {
            setLoading(false);
        }
    };

    return { getStatus, loading, error };
};

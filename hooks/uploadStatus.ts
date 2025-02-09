import { useState } from "react";
import { api } from "@/api/api";

export const useUploadStatus = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const uploadStatus = async (file: any, token: any | null) => {
        if (!token) {
            setError("User not authenticated");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post("/api/v1/status/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to upload status";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { uploadStatus, loading, error };
};

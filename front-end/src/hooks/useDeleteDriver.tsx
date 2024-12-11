import { useState } from "react";
import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import useSWR from "swr"; // Import useSWR to use the hook for revalidation

export const useDeleteDriver = (onSuccess?: () => void) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteDriver = async (driverId: number): Promise<boolean> => {
        setIsDeleting(true);
        setError(null);

        try {
            const token = getToken();

            await axios.delete(`http://127.0.0.1:5000/drivers/${driverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Call the onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }

            return true;
        } catch (err) {
            const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Failed to delete driver" : "An unexpected error occurred";

            setError(errorMessage);
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteDriver, isDeleting, error };
};

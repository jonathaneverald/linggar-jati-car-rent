import { useState } from "react";
import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import useSWR from "swr"; // Import useSWR to use the hook for revalidation

// Modify your useDeleteCar hook to accept mutate as a parameter
export const useDeleteCar = (onSuccess?: () => void) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteCar = async (carId: number): Promise<boolean> => {
        setIsDeleting(true);
        setError(null);

        try {
            const token = getToken();

            await axios.delete(`http://127.0.0.1:5000/cars/${carId}`, {
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
            const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Failed to delete car" : "An unexpected error occurred";

            setError(errorMessage);
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteCar, isDeleting, error };
};

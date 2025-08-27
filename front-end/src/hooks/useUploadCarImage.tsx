import { useState } from "react";
import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import { mutate } from "swr";

interface UploadImageResponse {
    success: boolean;
    message: string;
}

export const useUploadImage = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (carId: number, carImages: File[]): Promise<boolean> => {
        setIsUploading(true);
        setError(null);

        try {
            const token = getToken();

            const formData = new FormData();
            carImages.forEach((carImage) => {
                formData.append("images", carImage);
            });

            const response = await axios.put<UploadImageResponse>(`http://127.0.0.1:5000/cars/upload-image/${carId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // Trigger a revalidation of the transaction data
            await mutate((key) => typeof key === "string" && key.includes("/cars"));

            return response.data.success;
        } catch (err) {
            const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Failed to upload payment proof!" : "An unexpected error occurred";

            setError(errorMessage);
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadImage, isUploading, error };
};

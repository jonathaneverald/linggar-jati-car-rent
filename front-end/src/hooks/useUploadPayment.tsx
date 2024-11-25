import { useState } from "react";
import { getToken } from "@/utils/tokenUtils";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";

interface UploadPaymentResponse {
    success: boolean;
    message: string;
}

export const useUploadPayment = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadPayment = async (transactionId: number, paymentProofImage: File): Promise<boolean> => {
        setIsUploading(true);
        setError(null);

        try {
            const token = getToken();

            const formData = new FormData();
            formData.append("payment_proof_image", paymentProofImage);

            const response = await axios.put<UploadPaymentResponse>(`http://127.0.0.1:5000/transactions/upload-payment-proof/${transactionId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // Trigger a revalidation of the transaction data
            await mutate((key) => typeof key === "string" && key.includes("/transactions/customer"));

            return response.data.success;
        } catch (err) {
            const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Failed to upload payment proof!" : "An unexpected error occurred";

            setError(errorMessage);
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadPayment, isUploading, error };
};

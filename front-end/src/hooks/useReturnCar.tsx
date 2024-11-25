import { useState } from "react";
import { getToken } from "@/utils/tokenUtils";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";

interface ReturnCarResponse {
    success: boolean;
    message: string;
}

export const useReturnCar = () => {
    const [isReturning, setIsReturning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const returnCar = async (transactionId: number, return_date: string): Promise<boolean> => {
        setIsReturning(true);
        setError(null);

        try {
            const token = getToken();

            const response = await axios.put<ReturnCarResponse>(
                `http://127.0.0.1:5000/transactions/return-car/${transactionId}`,
                { return_date },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Trigger a revalidation of the transaction data
            await mutate((key) => typeof key === "string" && key.includes("/transactions/customer"));

            return true;
        } catch (err) {
            const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Failed to return car!" : "An unexpected error occurred";

            setError(errorMessage);
            return false;
        } finally {
            setIsReturning(false);
        }
    };

    return { returnCar, isReturning, error };
};

import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

type CreateTransactionForm = {
    car_name: string;
    driver_name?: string | null;
    start_date: string;
    end_date: string;
};

const useCreateTransaction = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const onSubmit: SubmitHandler<CreateTransactionForm> = async (data) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = getToken();
            const response = await axios.post("http://localhost:5000/transactions", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                setSuccess(true);
                return response.data;
            } else {
                setError("Failed to create transaction");
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to create transaction";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        onSubmit,
        loading,
        error,
        success,
    };
};

export default useCreateTransaction;

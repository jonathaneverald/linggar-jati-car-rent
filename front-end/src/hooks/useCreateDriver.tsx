import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

type CreateDriverForm = {
    name: string;
    gender: string;
    dob: string;
    address: string;
    phone_number: string;
    license_number: string;
    status: string;
};

const useCreateDriver = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const onSubmit: SubmitHandler<CreateDriverForm> = async (data) => {
        // Don't proceed if already loading
        if (loading) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = getToken();
            const response = await axios.post("http://localhost:5000/drivers", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setSuccess(true);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to create driver";
            setError(errorMessage);
            throw err;
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

export default useCreateDriver;

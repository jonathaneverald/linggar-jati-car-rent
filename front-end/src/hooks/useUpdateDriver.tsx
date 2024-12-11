import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import { useState } from "react";

export type UpdateDriverForm = {
    name: string;
    gender: string;
    dob: string;
    address: string;
    phone_number: string;
    license_number: string;
    status: string;
};

const useUpdateDriver = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const onSubmit = async (data: UpdateDriverForm, driverId: number) => {
        // Don't proceed if already loading
        if (loading) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = getToken();
            const response = await axios.put(`http://localhost:5000/drivers/${driverId}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setSuccess(true);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to update driver";
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

export default useUpdateDriver;

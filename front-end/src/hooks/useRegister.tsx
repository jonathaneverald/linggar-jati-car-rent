import axios from "axios";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    address: string;
    phone_number: string;
};

const useRegister = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post("http://127.0.0.1:5000/register", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                setSuccess(true);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Registration failed";
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

export default useRegister;

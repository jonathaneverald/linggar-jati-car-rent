import { useState } from "react";
import axios from "axios";
import { SubmitHandler } from "react-hook-form";
import { LoginResponse } from "@/types/login";

type LoginFormData = {
    email: string;
    password: string;
};

const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post<LoginResponse>("http://127.0.0.1:5000/login", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Return response data if the request is successful
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // Handle Axios error response
                setError(err.response?.data.message || "Login failed");
            } else {
                // Handle any other unexpected errors
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        onSubmit,
        loading,
        error,
    };
};

export default useLogin;

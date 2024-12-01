import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

type CreateCarForm = {
    car_brand: string;
    type: string;
    name: string;
    transmission: string;
    fuel: string;
    color: string;
    plate_number: string;
    capacity: number;
    registration_number: number;
    price: number;
    status: string;
};

const useCreateCar = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const onSubmit: SubmitHandler<CreateCarForm> = async (data) => {
        // Don't proceed if already loading
        if (loading) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = getToken();
            const response = await axios.post("http://localhost:5000/cars", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess(true);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to create car";
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

export default useCreateCar;

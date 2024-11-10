import { useState } from "react";
import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import { mutate } from "swr";

export const useUpdateProfile = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateProfile = async (newName: string, newAddress: string, newPhone: string) => {
        setIsUpdating(true);
        setError(null);

        try {
            const token = getToken();

            const response = await axios.put(
                "http://127.0.0.1:5000/profile",
                {
                    name: newName,
                    address: newAddress,
                    phone_number: newPhone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Check if the response indicates success (optional with axios)
            if (response.status !== 200) {
                console.error("Unexpected response status:", response.status);
                throw new Error("Failed to update profile");
            }

            // Trigger a revalidation of the profile data
            await mutate("http://127.0.0.1:5000/profile");
            setIsUpdating(false);
            return true; // Indicate success
        } catch (err) {
            setError(axios.isAxiosError(err) && err.response ? err.response.data.message || "Failed to update profile!" : "Failed to update profile!");
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateProfile, isUpdating, error };
};

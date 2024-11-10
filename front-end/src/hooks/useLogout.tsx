import { useState } from "react";
import { useRouter } from "next/router";
import { getToken, removeToken } from "@/utils/tokenUtils";
import { useAppDispatch } from "./reduxHooks";
import axios from "axios";

const useLogout = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = getToken();

            const response = await axios.get("http://127.0.0.1:5000/logout", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                // withCredentials: true, // Include cookies if needed
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Logout failed");
            }

            // dispatch(resetSellerProfile()); // Dispatch the reset action
            removeToken(); // Remove the token from cookies

            // Redirect to login page after a delay
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err) {
            const errorMessage = axios.isAxiosError(err) && err.response ? err.response.data.message || "Logout failed" : "An unexpected error occurred";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        handleLogout,
        loading,
        error,
    };
};

export default useLogout;

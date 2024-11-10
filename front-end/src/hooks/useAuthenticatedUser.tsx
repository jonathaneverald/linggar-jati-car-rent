import { useRouter } from "next/router";
import axios from "axios";
import { User } from "@/types/user";
import { getToken, removeToken } from "@/utils/tokenUtils";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { setUserData, setLoading } from "../store/userSlice";
import { useEffect, useCallback, useRef } from "react";

const useUserProfile = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data: user, loading, error } = useAppSelector((state) => state.user);
    const fetchedRef = useRef(false);

    const fetchUserData = useCallback(async () => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        dispatch(setLoading(true));
        try {
            const token = getToken();

            const response = await axios.get("http://127.0.0.1:5000/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // If response is successful, set user data
            dispatch(setUserData(response.data.data));
        } catch (error) {
            // Handle errors (such as token expiry or network issues)
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.data?.msg === "Token has expired") {
                    removeToken();
                    console.log("Token expired:", error.response.data);
                    router.push("/login"); // Redirect to login if token expired
                } else {
                    console.log("Error fetching user data:", error.response.data);
                }
            } else {
                console.log("Unexpected error:", error);
            }
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, router]);

    useEffect(() => {
        if (!loading && !user) {
            fetchUserData();
        }
    }, [loading, user, fetchUserData]);

    return { user: user as User, error, isLoading: loading, fetchUserData };
};

export default useUserProfile;

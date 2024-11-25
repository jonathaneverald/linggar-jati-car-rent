import { useState, useEffect } from "react";
import axios from "axios";

type Driver = {
    id: string;
    name: string;
};

const useFetchAvailableDrivers = (token: string) => {
    const [drivers, setDrivers] = useState<Driver[] | null>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:5000/drivers-available", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDrivers(res.data.data); // Update state with the fetched drivers
            } catch (err: any) {
                if (axios.isAxiosError(err)) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchDrivers();
        }
    }, [token]);

    return { drivers, loading, error };
};

export default useFetchAvailableDrivers;

import { getToken } from "@/utils/tokenUtils";
import useSWR from "swr";
import useDebounce from "./useDebounce";
import axios from "axios";
import { useEffect } from "react";

type fetchCarsParams = {
    page: number;
    per_page: number;
    car_brand?: string;
    type?: string;
};

const fetcher = async (url: string) => {
    const token = getToken();

    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

const buildUrl = (params: fetchCarsParams): string => {
    const { page, per_page, car_brand = "", type = "" } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(car_brand && { car_brand }),
        ...(type && { type }),
    });

    return `http://127.0.0.1:5000/cars?${queryParams.toString()}`;
};

const useFetchCars = (params: fetchCarsParams) => {
    // Debounce all params together as an object
    const debouncedParams = useDebounce(params, 300);

    // Create URL only after params are debounced
    const url = buildUrl(debouncedParams);

    // Use SWR with the debounced URL and configured options
    const { data, error } = useSWR(url, fetcher, {
        revalidateOnFocus: false, // prevent refetching on window focus
        revalidateOnReconnect: false, // prevent refetching on reconnect
        refreshWhenHidden: false, // avoid refreshing in the background
        dedupingInterval: 5000, // avoid repeated fetches within 5 seconds
    });

    // Debugging console log to track fetch occurrences
    useEffect(() => {
        console.log("Fetching cars data from:", url);
    }, [url]);

    return {
        cars: data?.data?.data || [],
        pagination: data?.data?.pagination || {},
        isLoading: !error && !data,
        isError: error,
    };
};

export default useFetchCars;

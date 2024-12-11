import { getToken } from "@/utils/tokenUtils";
import useSWR from "swr";
import useDebounce from "./useDebounce";
import axios from "axios";
import { useEffect } from "react";

type fetchDriversParams = {
    page: number;
    per_page: number;
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

const buildUrl = (params: fetchDriversParams): string => {
    const { page, per_page } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
    });

    return `http://127.0.0.1:5000/drivers?${queryParams.toString()}`;
};

const useFetchDrivers = (params: fetchDriversParams) => {
    // Debounce all params together as an object
    const debouncedParams = useDebounce(params, 300);

    // Create URL only after params are debounced
    const url = buildUrl(debouncedParams);

    // Use SWR with the debounced URL and configured options
    const { data, error, mutate } = useSWR(url, fetcher, {
        revalidateOnFocus: false, // prevent refetching on window focus
        revalidateOnReconnect: false, // prevent refetching on reconnect
        refreshWhenHidden: false, // avoid refreshing in the background
        dedupingInterval: 5000, // avoid repeated fetches within 5 seconds
    });

    // Debugging console log to track fetch occurrences
    useEffect(() => {
        console.log("Fetching drivers data from:", url);
    }, [url]);

    return {
        drivers: data?.data?.drivers || [],
        pagination: data?.data?.pagination || {},
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
};

export default useFetchDrivers;

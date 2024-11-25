import useSWR from "swr";
import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import { useEffect } from "react";
import useDebounce from "./useDebounce";

type FetchTransactionsParams = {
    page: number;
    per_page: number;
};

type PaginationData = {
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
    total_transactions: number;
};

interface Car {
    car_brand: string;
    car_name: string;
    car_price: string;
    car_type: string;
    car_image: string;
}

interface Driver {
    driver_name: string;
}

interface Transaction {
    id: number;
    rental_status: string;
    payment_status: string;
    start_date: string;
    end_date: string;
    return_date: string;
    invoice: string;
    late_fee: string | null;
    payment_proof: string;
    total_cost: string;
    car_data: Car;
    driver_data: Driver | null;
}

const fetcher = async (url: string) => {
    const token = getToken();

    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

const buildUrl = (params: FetchTransactionsParams): string => {
    const { page, per_page } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
    });

    return `http://127.0.0.1:5000/transactions/customer?${queryParams.toString()}`;
};

const useTransactionsCustomer = (params: FetchTransactionsParams) => {
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
        console.log("Fetching transactions data from:", url);
    }, [url]);

    return {
        transactions: (data?.data?.transactions as Transaction[]) || [],
        pagination: (data?.data?.pagination as PaginationData) || {},
        isLoading: !error && !data,
        isError: error,
    };
};

export default useTransactionsCustomer;

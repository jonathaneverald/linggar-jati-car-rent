import { getToken } from "@/utils/tokenUtils";
import useSWR from "swr";
import useDebounce from "./useDebounce";
import axios from "axios";

type fetchCarsParams = {
    page: number;
    per_page: number;
    car_brand?: string;
    type?: string;
};

const fetcher = async (url: string) => {
    // const token = getToken();

    const response = await axios.get(url, {
        // headers: {
        //     Authorization: `Bearer ${token}`,
        // },
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

    // Use SWR with the debounced URL
    const { data, error } = useSWR(url, fetcher);

    return {
        cars: data?.data?.data || [],
        pagination: data?.data?.pagination || {},
        isLoading: !error && !data,
        isError: error,
    };
};

export default useFetchCars;

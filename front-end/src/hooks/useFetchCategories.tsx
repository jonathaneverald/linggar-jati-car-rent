import { CarCategories, CategoriesData, UseCategoriesReturn } from "@/types/car";
import { getToken } from "@/utils/tokenUtils";
import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchCategories = (): UseCategoriesReturn => {
    const [categories, setCategories] = useState<CarCategories[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = getToken();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const response = await axios.get<CategoriesData>("http://127.0.0.1:5000/car-categories", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setCategories(response.data.data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred while fetching categories");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Calculate unique brands and types
    const uniqueBrands = Array.from(new Set(categories.map((cat) => cat.car_brand)));
    const uniqueTypes = Array.from(new Set(categories.map((cat) => cat.type)));

    return { categories, loading, error, uniqueBrands, uniqueTypes };
};

export default useFetchCategories;

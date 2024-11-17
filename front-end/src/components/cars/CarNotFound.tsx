import React from "react";
import { Car, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

const NoCarFound = () => {
    const router = useRouter();

    const handleClearFilters = () => {
        router.push({
            pathname: router.pathname,
            query: {},
        });
    };

    const hasActiveFilters = Object.keys(router.query).some((key) => key !== "page" && key !== "per_page" && router.query[key]);

    return (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-gray-50 rounded-full p-6 mb-6">
                <SearchX className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-500 mb-6 max-w-md">
                {hasActiveFilters ? "No cars match your current filters. Try adjusting your search criteria." : "There are no cars available at the moment. Please check back later."}
            </p>
            {hasActiveFilters && (
                <Button onClick={handleClearFilters} variant="outline" className="gap-2">
                    <Car className="w-4 h-4" />
                    Clear all filters
                </Button>
            )}
        </div>
    );
};

export default NoCarFound;

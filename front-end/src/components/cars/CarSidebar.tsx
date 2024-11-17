import { useRouter } from "next/router";
import useFetchCategories from "@/hooks/useFetchCategories";
import React from "react";
import { Car, Filter } from "lucide-react";

const CarSidebar = () => {
    const router = useRouter();
    const { car_brand, type } = router.query;
    const { loading, error, uniqueBrands, uniqueTypes } = useFetchCategories();

    const handleBrandClick = (brand: string) => {
        router.push({
            pathname: router.pathname,
            query: {
                ...router.query,
                car_brand: brand === car_brand ? undefined : brand,
                page: 1,
            },
        });
    };

    const handleTypeClick = (type: string) => {
        router.push({
            pathname: router.pathname,
            query: {
                ...router.query,
                type: type === router.query.type ? undefined : type,
                page: 1,
            },
        });
    };

    const handleClearFilters = () => {
        router.push({
            pathname: router.pathname,
            query: {
                page: 1,
            },
        });
    };

    if (loading) {
        return (
            <div className="w-full md:block hidden bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-10 bg-gray-100 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full md:block hidden bg-white rounded-lg shadow-sm border border-red-100 p-6">
                <div className="text-red-500 flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>Error loading filters</span>
                </div>
            </div>
        );
    }

    const hasActiveFilters = car_brand || type;

    return (
        <div className="w-full md:block hidden bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                    </h2>
                    {hasActiveFilters && (
                        <button onClick={handleClearFilters} className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                            Clear all
                        </button>
                    )}
                </div>
                <p className="text-sm text-gray-500">Filter cars by brand and type</p>
            </div>

            {/* Brand Section */}
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Car Brand
                </h3>
                <div className="space-y-2">
                    {uniqueBrands.map((brand) => (
                        <button
                            key={brand}
                            onClick={() => handleBrandClick(brand)}
                            className={`w-full group rounded-lg transition-all duration-200 ease-in-out
                                ${brand === car_brand ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}
                            `}
                        >
                            <div className="flex items-center px-3 py-2">
                                <div
                                    className={`w-2 h-2 rounded-full mr-3 transition-all duration-200
                                    ${brand === car_brand ? "bg-blue-500" : "bg-transparent group-hover:bg-gray-300"}
                                `}
                                />
                                {brand}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Type Section */}
            <div className="p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Car Type
                </h3>
                <div className="space-y-2">
                    {uniqueTypes.map((carType) => (
                        <button
                            key={carType}
                            onClick={() => handleTypeClick(carType)}
                            className={`w-full group rounded-lg transition-all duration-200 ease-in-out
                                ${carType === type ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}
                            `}
                        >
                            <div className="flex items-center px-3 py-2">
                                <div
                                    className={`w-2 h-2 rounded-full mr-3 transition-all duration-200
                                    ${carType === type ? "bg-blue-500" : "bg-transparent group-hover:bg-gray-300"}
                                `}
                                />
                                {carType}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarSidebar;

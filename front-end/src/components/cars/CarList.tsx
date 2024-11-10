import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import CarCard from "@/components/card/CarCard";
import { Car } from "@/types/car";
import CarCardLoading from "@/components/loading/CarCardLoading";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import useFetchCars from "@/hooks/useFetchCars";

const CarList = () => {
    const router = useRouter();
    const { car_brand, type, page = 1, per_page = 8 } = router.query;
    const [currentPage, setCurrentPage] = useState<number>(Number(page));
    const initialFetchDone = useRef(false); // To track initial fetch and prevent unnecessary updates

    // Memoize params to prevent unnecessary re-fetching
    const params = useMemo(
        () => ({
            page: currentPage,
            per_page: Number(per_page),
            car_brand: car_brand as string,
            type: type as string,
        }),
        [currentPage, per_page, car_brand, type]
    );

    // Use the hook with params object
    const { cars, pagination, isLoading, isError } = useFetchCars(params);

    useEffect(() => {
        if (!initialFetchDone.current) {
            initialFetchDone.current = true;
            return;
        }

        // Update router query only if the current page changes after the initial render
        router.push({
            pathname: router.pathname,
            query: { ...router.query, page: currentPage },
        });
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return (
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4">
                <CarCardLoading />
            </div>
        );
    }

    if (isError) {
        return <p>Failed to load cars</p>;
    }

    const { total_pages = 1, next_page, prev_page } = pagination;

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cars.map((car: Car) => (
                        <CarCard
                            key={car.id}
                            image={car.image || "https://via.placeholder.com/300x200?text=No+Image"}
                            car_name={car.name}
                            car_brand={car.car_brand}
                            type={car.type}
                            status={car.status}
                            price={car.price}
                            transmission={car.transmission}
                            car_slug={car.slug}
                        />
                    ))}
                </div>
                <div className="mt-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" onClick={() => handlePageChange(prev_page || 1)} className={!prev_page ? "pointer-events-none opacity-50" : ""} />
                            </PaginationItem>
                            {[...Array(total_pages)].map((_, index) => {
                                const page = index + 1;
                                let startPage = Math.max(1, currentPage - 2);
                                let endPage = Math.min(total_pages, currentPage + 2);

                                if (total_pages > 5) {
                                    if (currentPage <= 3) {
                                        startPage = 1;
                                        endPage = 5;
                                    } else if (currentPage + 2 >= total_pages) {
                                        startPage = total_pages - 4;
                                        endPage = total_pages;
                                    }
                                }

                                if (page >= startPage && page <= endPage) {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationLink href="#" isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                                return null;
                            })}
                            <PaginationItem>
                                <PaginationNext href="#" onClick={() => handlePageChange(next_page || total_pages)} className={!next_page ? "pointer-events-none opacity-50" : ""} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </main>
        </div>
    );
};

export default CarList;

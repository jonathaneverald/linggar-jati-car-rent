import React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const CarCardLoading = () => {
    return (
        <>
            {Array.from({ length: 10 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                    <div className="relative">
                        <Skeleton className="aspect-[4/3] w-full bg-gray-300" />
                    </div>
                    <div className="p-4">
                        <Skeleton className="h-4 w-3/4 mb-1 bg-gray-300" />
                        <Skeleton className="h-4 w-full mb-1 bg-gray-300" />
                        <Skeleton className="h-4 w-2/4 mb-1 bg-gray-300" />
                    </div>
                </Card>
            ))}
        </>
    );
};

export default CarCardLoading;

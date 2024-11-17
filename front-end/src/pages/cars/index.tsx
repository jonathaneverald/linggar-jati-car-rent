import CarList from "@/components/cars/CarList";
import CarSidebar from "@/components/cars/CarSidebar";
import React from "react";

const Cars: React.FC = () => {
    return (
        <div className="md:container bg-gray-100 place-self-center">
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="w-full md:col-span-1 lg:col-span-1 py-9">
                    <CarSidebar />
                </div>
                <div className="md:col-span-2 lg:col-span-3 ">
                    <CarList />
                </div>
            </div>
        </div>
    );
};

export default Cars;

import CarList from "@/components/cars/CarList";
// import Sidebar from "@/components/layouts/Sidebar";
// import dynamic from "next/dynamic";
import React from "react";

const Cars: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <CarList />
        </div>
    );
};

export default Cars;

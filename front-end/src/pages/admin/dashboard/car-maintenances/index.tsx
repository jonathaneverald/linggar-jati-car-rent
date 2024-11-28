import AdminSidebar from "@/components/layouts/AdminSidebar";
import React from "react";

const CarMaintenancePage: React.FC = () => {
    return (
        <div className="flex h-[calc(100vh-4rem)] ">
            {" "}
            {/* Adjust based on your header height */}
            <AdminSidebar />
            <main className="flex-1 overflow-auto p-6 bg-gray-50">{/* Your main content goes here */}</main>
        </div>
    );
};

export default CarMaintenancePage;

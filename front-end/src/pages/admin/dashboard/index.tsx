import React from "react";
import AdminSidebar from "@/components/layouts/AdminSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";

const AdminPage: React.FC = () => {
    return (
        <div className="flex h-[calc(100vh-4rem)] ">
            {" "}
            {/* Adjust based on your header height */}
            <AdminSidebar />
            <main className="flex-1 overflow-auto p-6 bg-gray-50">{/* content here*/}</main>
        </div>
    );
};

export default AdminPage;

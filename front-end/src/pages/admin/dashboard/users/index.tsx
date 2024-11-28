import React from "react";
import AdminSidebar from "@/components/layouts/AdminSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { User } from "@/types/user";

const UserPage: React.FC = () => {
    const users: User[] = [
        {
            id: "1",
            role_id: 1,
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            address: "123 Main St",
            phone_number: "+1234567890",
        },
        // Add more sample data as needed
    ];
    return (
        <div className="flex h-[calc(100vh-4rem)] ">
            {" "}
            {/* Adjust based on your header height */}
            <AdminSidebar />
            <main className="flex-1 overflow-auto p-6 bg-gray-50">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                        <Button onClick={() => console.log("Add new user")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Role ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.id}</TableCell>
                                        <TableCell>{user.role_id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                        <TableCell>{user.phone_number}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => console.log("Edit user", user.id)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => console.log("Delete user", user.id)}>
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserPage;

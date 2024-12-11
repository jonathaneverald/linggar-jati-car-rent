import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import useFetchDrivers from "@/hooks/useFetchDrivers";
import { Driver } from "@/types/driver";
import { useDeleteDriver } from "@/hooks/useDeleteDriver";
import AddDriverModal from "@/components/drivers/DriverAddModal";
import UpdateDriverModal from "@/components/drivers/DriverUpdateModal";
import { format } from "date-fns";

const DriverPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const per_page = 10;
    const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
    const [isUpdateDriverModalOpen, setIsUpdateDriverModalOpen] = useState(false);
    const [selectedDriver, setIsSelectedDriver] = useState(0);
    const { deleteDriver, isDeleting, error: deleteError } = useDeleteDriver(() => mutate());

    const toggleAddDriverModal = () => {
        setIsAddDriverModalOpen((prev) => !prev);
    };

    const handleAddDriver = async () => {
        try {
            await mutate(); // Trigger a revalidation of the data
            setIsAddDriverModalOpen(false);
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    const handleUpdateDriver = async () => {
        try {
            await mutate(); // Refresh the drivers data
            setIsUpdateDriverModalOpen(false); // Close the modal after successful update
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    const handleEditButton = (driverId: number) => {
        setIsSelectedDriver(driverId);
        setIsUpdateDriverModalOpen(true);
    };

    // Memoize params to prevent unnecessary re-fetching
    const params = useMemo(
        () => ({
            page: currentPage,
            per_page: Number(per_page),
        }),
        [currentPage, per_page]
    );

    const { drivers, pagination, isLoading, isError, mutate } = useFetchDrivers(params);

    const handleNextPage = () => {
        if (currentPage < pagination.total_pages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleDeleteDriver = async (driverId: number) => {
        const success = await deleteDriver(driverId);
        if (success) {
            // Driver was deleted successfully, mutate will be called via the onSuccess callback
            console.log("Driver deleted successfully");
        } else {
            console.error("Failed to delete a driver:", deleteError);
        }
    };

    if (isError) return <div>Error loading drivers</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Drivers</h2>
                <Button onClick={toggleAddDriverModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Driver
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">No</TableHead>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Date of Birth</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>License Number</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={13} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : drivers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={13} className="text-center">
                                    No drivers found
                                </TableCell>
                            </TableRow>
                        ) : (
                            drivers.map((driver: Driver, index: number) => (
                                <TableRow key={driver.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="font-medium">{driver.id}</TableCell>
                                    <TableCell>{driver.name}</TableCell>
                                    <TableCell>{driver.gender}</TableCell>
                                    {/* <TableCell>{driver.dob}</TableCell> */}
                                    <TableCell>{format(new Date(driver.dob), "yyyy-MM-dd")}</TableCell>
                                    <TableCell>{driver.address}</TableCell>
                                    <TableCell>{driver.phone_number}</TableCell>
                                    <TableCell>{driver.license_number}</TableCell>
                                    <TableCell>{driver.status}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditButton(driver.id)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => handleDeleteDriver(driver.id)}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * per_page + 1} to {Math.min(currentPage * per_page, pagination.total_drivers)} of {pagination.total_drivers} drivers
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="text-sm">
                        Page {currentPage} of {pagination.total_pages}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === pagination.total_pages}>
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <AddDriverModal isOpen={isAddDriverModalOpen} onOpenChange={setIsAddDriverModalOpen} onCreateDriver={handleAddDriver} />
            <UpdateDriverModal isOpen={isUpdateDriverModalOpen} onOpenChange={setIsUpdateDriverModalOpen} driverId={selectedDriver} onUpdateDriver={handleUpdateDriver} />
        </div>
    );
};

export default DriverPage;

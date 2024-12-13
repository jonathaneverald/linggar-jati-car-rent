import React, { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import useFetchMaintenances from "@/hooks/useFetchMaintenances";
import { CarMaintenance } from "@/types/car_maintenance";
import { formatIntToIDR } from "@/utils/currency";
import { useDeleteMaintenance } from "@/hooks/useDeleteMaintenance";
import AddCarMaintenanceModal from "@/components/car-maintenances/CarMaintenanceAddModal";
import UpdateCarMaintenanceModal from "@/components/car-maintenances/CarMaintenanceUpdateModal";

const CarMaintenancePage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const per_page = 10;
    const [isAddMaintenanceModalOpen, setIsAddMaintenanceModalOpen] = useState(false);
    const [isUpdateMaintenanceModalOpen, setIsUpdateMaintenanceModalOpen] = useState(false);
    const [selectedMaintenance, setIsSelectedMaintenance] = useState(0);
    const { deleteMaintenance, isDeleting, error: deleteError } = useDeleteMaintenance(() => mutate());

    const toggleAddMaintenanceModal = () => {
        setIsAddMaintenanceModalOpen((prev) => !prev);
    };

    const handleAddMaintenance = async () => {
        try {
            await mutate(); // Trigger a revalidation of the data
            setIsAddMaintenanceModalOpen(false);
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    const handleUpdateMaintenance = async () => {
        try {
            await mutate(); // Refresh the car maintenances data
            setIsUpdateMaintenanceModalOpen(false); // Close the modal after successful update
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    const handleEditButton = (maintenanceId: number) => {
        setIsSelectedMaintenance(maintenanceId);
        setIsUpdateMaintenanceModalOpen(true);
    };

    // Memoize params to prevent unnecessary re-fetching
    const params = useMemo(
        () => ({
            page: currentPage,
            per_page: Number(per_page),
        }),
        [currentPage, per_page]
    );

    const { car_maintenances, pagination, isLoading, isError, mutate } = useFetchMaintenances(params);

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

    const handleDeleteMaintenance = async (maintenanceId: number) => {
        const success = await deleteMaintenance(maintenanceId);
        if (success) {
            // Car maintenance was deleted successfully, mutate will be called via the onSuccess callback
            console.log("Car maintenance deleted successfully");
        } else {
            console.error("Failed to delete a car maintenance:", deleteError);
        }
    };

    if (isError) return <div>Error loading car maintenances</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Car Maintenances</h2>
                <Button onClick={toggleAddMaintenanceModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Maintenance
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">No</TableHead>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Car ID</TableHead>
                            <TableHead>Car Name</TableHead>
                            <TableHead>Maintenance Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Cost</TableHead>
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
                        ) : car_maintenances.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={13} className="text-center">
                                    No car maintenances found
                                </TableCell>
                            </TableRow>
                        ) : (
                            car_maintenances.map((car_maintenance: CarMaintenance, index: number) => (
                                <TableRow key={car_maintenance.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="font-medium">{car_maintenance.id}</TableCell>
                                    <TableCell>{car_maintenance.car_id}</TableCell>
                                    <TableCell>{car_maintenance.car_name}</TableCell>
                                    <TableCell>{format(new Date(car_maintenance.maintenance_date), "yyyy-MM-dd")}</TableCell>
                                    <TableCell>{car_maintenance.description}</TableCell>
                                    <TableCell>{formatIntToIDR(car_maintenance.cost)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditButton(car_maintenance.id)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => handleDeleteMaintenance(car_maintenance.id)}>
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
                    Showing {(currentPage - 1) * per_page + 1} to {Math.min(currentPage * per_page, pagination.total_maintenances)} of {pagination.total_maintenances} car maintenances
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
            <AddCarMaintenanceModal isOpen={isAddMaintenanceModalOpen} onOpenChange={setIsAddMaintenanceModalOpen} onCreateCarMaintenance={handleAddMaintenance} />
            <UpdateCarMaintenanceModal
                isOpen={isUpdateMaintenanceModalOpen}
                onOpenChange={setIsUpdateMaintenanceModalOpen}
                maintenanceId={selectedMaintenance}
                onUpdateCarMaintenance={handleUpdateMaintenance}
            />
        </div>
    );
};

export default CarMaintenancePage;

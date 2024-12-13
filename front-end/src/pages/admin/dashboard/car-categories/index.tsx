import React, { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import useFetchCategories from "@/hooks/useFetchCarCategories";
import { CarCategories } from "@/types/car";
import AddCarCategoryModal from "@/components/car-categories/CarCategoryAddModal";

const CarCategoryPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const per_page = 10;
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [selectedCategory, setIsSelectedCategory] = useState(0);

    const toggleAddCategoryModal = () => {
        setIsAddCategoryModalOpen((prev) => !prev);
    };

    const handleAddCategory = async () => {
        try {
            await mutate(); // Trigger a revalidation of the data
            setIsAddCategoryModalOpen(false);
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    // Memoize params to prevent unnecessary re-fetching
    const params = useMemo(
        () => ({
            page: currentPage,
            per_page: Number(per_page),
        }),
        [currentPage, per_page]
    );

    const { car_categories, pagination, isLoading, isError, mutate } = useFetchCategories(params);

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

    if (isError) return <div>Error loading car categories</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Car Categories</h2>
                <Button onClick={toggleAddCategoryModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">No</TableHead>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Type</TableHead>
                            {/* <TableHead className="text-right">Actions</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={13} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : car_categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={13} className="text-center">
                                    No car categories found
                                </TableCell>
                            </TableRow>
                        ) : (
                            car_categories.map((car_category: CarCategories, index: number) => (
                                <TableRow key={car_category.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="font-medium">{car_category.id}</TableCell>
                                    <TableCell>{car_category.car_brand}</TableCell>
                                    <TableCell>{car_category.type}</TableCell>
                                    {/* <TableCell className="text-right">
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
                                    </TableCell> */}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * per_page + 1} to {Math.min(currentPage * per_page, pagination.total_car_categories)} of {pagination.total_car_categories} car categories
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
            <AddCarCategoryModal isOpen={isAddCategoryModalOpen} onOpenChange={setIsAddCategoryModalOpen} onCreateCarCategory={handleAddCategory} />
        </div>
    );
};

export default CarCategoryPage;

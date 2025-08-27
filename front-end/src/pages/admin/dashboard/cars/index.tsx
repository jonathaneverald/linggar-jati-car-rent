import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import { Car } from "@/types/car";
import useFetchCars from "@/hooks/useFetchCars";
import Image from "next/image";
import AddCarModal from "@/components/cars/CarAddModal";
import { useUploadImage } from "@/hooks/useUploadCarImage";
import { useDeleteCar } from "@/hooks/useDeleteCar";
import UpdateCarModal from "@/components/cars/CarUpdateModal";
import { formatIntToIDR } from "@/utils/currency";
import ImageModal from "@/components/ImageModal";

const CarPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const per_page = 10;
    const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
    const [isUpdateCarModalOpen, setIsUpdateCarModalOpen] = useState(false);
    const [selectedCar, setIsSelectedCar] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { uploadImage, isUploading, error: uploadError } = useUploadImage();
    const { deleteCar, isDeleting, error: deleteError } = useDeleteCar(() => mutate());

    const toggleAddCarModal = () => {
        setIsAddCarModalOpen((prev) => !prev);
    };

    const handleAddCar = async () => {
        try {
            await mutate(); // Trigger a revalidation of the data
            setIsAddCarModalOpen(false);
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    const handleUpdateCar = async () => {
        try {
            await mutate(); // Refresh the cars data
            setIsUpdateCarModalOpen(false); // Close the modal after successful update
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    const handleEditButton = (carSlug: string) => {
        setIsSelectedCar(carSlug);
        setIsUpdateCarModalOpen(true);
    };

    // Memoize params to prevent unnecessary re-fetching
    const params = useMemo(
        () => ({
            page: currentPage,
            per_page: Number(per_page),
        }),
        [currentPage, per_page]
    );

    const { cars, pagination, isLoading, isError, mutate } = useFetchCars(params);
    console.log("Cars: ", cars);

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

    const handleDeleteCar = async (carId: number) => {
        const success = await deleteCar(carId);
        if (success) {
            // Car was deleted successfully, mutate will be called via the onSuccess callback
            console.log("Car deleted successfully");
        } else {
            console.error("Failed to delete a car:", deleteError);
        }
    };

    // --- MODIFIED: This handler now supports multiple files ---
    const handleUploadImage = async (carId: number) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.multiple = true; // Allow multiple file selection
        fileInput.onchange = async (event) => {
            const fileList = (event.target as HTMLInputElement).files;
            if (fileList && fileList.length > 0) {
                const filesArray = Array.from(fileList); // Convert FileList to array
                const success = await uploadImage(carId, filesArray); // Pass the array to the hook
                if (success) {
                    console.log("Car images uploaded successfully");
                } else {
                    console.error("Failed to upload car images:", uploadError);
                }
            }
        };
        fileInput.click();
    };

    if (isError) return <div>Error loading cars</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Cars</h2>
                <Button onClick={toggleAddCarModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Car
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">No</TableHead>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Car Name</TableHead>
                            <TableHead>Car Brand</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Fuel</TableHead>
                            <TableHead>Transmission</TableHead>
                            <TableHead>Plate Number</TableHead>
                            <TableHead>Car Image</TableHead>
                            <TableHead>Price</TableHead>
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
                        ) : cars.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={13} className="text-center">
                                    No cars found
                                </TableCell>
                            </TableRow>
                        ) : (
                            cars.map((car: Car, index: number) => {
                                // Calculate total images for conditional rendering
                                const totalImages = (car.image ? 1 : 0) + (car.additional_images?.length || 0);

                                return (
                                    <TableRow key={car.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{car.id}</TableCell>
                                        <TableCell>{car.name}</TableCell>
                                        <TableCell>{car.car_brand}</TableCell>
                                        <TableCell>{car.type}</TableCell>
                                        <TableCell>{car.capacity}</TableCell>
                                        <TableCell>{car.color}</TableCell>
                                        <TableCell>{car.fuel}</TableCell>
                                        <TableCell>{car.transmission}</TableCell>
                                        <TableCell>{car.plate_number}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {/* Case 1: No images at all */}
                                                {!car.image && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="whitespace-nowrap hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                                        onClick={() => handleUploadImage(car.id)}
                                                        disabled={isUploading}
                                                    >
                                                        Upload Car Image
                                                    </Button>
                                                )}

                                                {/* Case 2: Display main image if it exists */}
                                                {car.image && (
                                                    <div className="relative h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedImage(car.image)}>
                                                        <Image
                                                            src={car.image}
                                                            alt={`${car.name} main image`}
                                                            fill
                                                            className="object-cover rounded-md"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = "/placeholder-car.png";
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Case 3: Display additional images */}
                                                {car.additional_images?.map((image) => (
                                                    <div key={image.id} className="relative h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedImage(image.url)}>
                                                        <Image
                                                            src={image.url}
                                                            alt={`${car.name} additional image`}
                                                            fill
                                                            className="object-cover rounded-md"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = "/placeholder-car.png";
                                                            }}
                                                        />
                                                    </div>
                                                ))}

                                                {/* Case 4: Show Add button if there's at least one image AND the total is less than 3 */}
                                                {car.image && totalImages < 3 && (
                                                    <Button variant="outline" size="icon" className="h-16 w-16 flex-shrink-0" onClick={() => handleUploadImage(car.id)} disabled={isUploading}>
                                                        <ImagePlus className="h-6 w-6" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatIntToIDR(car.price)}</TableCell>
                                        <TableCell>{car.status}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditButton(car.slug)}>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => handleDeleteCar(car.id)}>
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * per_page + 1} to {Math.min(currentPage * per_page, pagination.total_cars)} of {pagination.total_cars} cars
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
            <ImageModal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} imageUrl={selectedImage || ""} />

            <AddCarModal isOpen={isAddCarModalOpen} onOpenChange={setIsAddCarModalOpen} onCreateCar={handleAddCar} />
            <UpdateCarModal isOpen={isUpdateCarModalOpen} onOpenChange={setIsUpdateCarModalOpen} carSlug={selectedCar} onUpdateCar={handleUpdateCar} />
        </div>
    );
};

export default CarPage;

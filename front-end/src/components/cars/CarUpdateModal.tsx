import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import useCreateCar from "@/hooks/useCreateCar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Car } from "@/types/car";
import useFetchCarDetails from "@/hooks/useFetchCarDetails";
import useUpdateCar, { UpdateCarForm } from "@/hooks/useUpdateCar";
import { getToken } from "@/utils/tokenUtils";

interface UpdateCarModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    carSlug: string;
    onUpdateCar?: () => void;
}

const FormSchema = z.object({
    car_brand: z.string().max(50, { message: "Car brand cannot exceed 50 characters." }).optional(),
    type: z.string().max(50, { message: "Type cannot exceed 50 characters." }).optional(),
    name: z.string().max(100, { message: "Name cannot exceed 100 characters." }).optional(),
    transmission: z.string().max(100, { message: "Name cannot exceed 100 characters." }).optional(),
    fuel: z.string().max(100, { message: "Name cannot exceed 100 characters." }).optional(),
    color: z.string().max(50, { message: "Color cannot exceed 50 characters." }).optional(),
    plate_number: z.string().max(50, { message: "Plate number cannot exceed 50 characters." }).optional(),
    capacity: z.number().int().positive({ message: "Capacity must be a positive integer." }).optional(),
    registration_number: z.number().int().positive({ message: "Registration number must be a positive integer." }).optional(),
    price: z.number().positive({ message: "Price must be a positive number." }).optional(),
    status: z.string().max(100, { message: "Name cannot exceed 100 characters." }).optional(),
});

type FormData = z.infer<typeof FormSchema>;

const UpdateCarModal: React.FC<UpdateCarModalProps> = ({ isOpen, onOpenChange, carSlug, onUpdateCar }) => {
    const token = getToken();
    const [car, setCar] = useState<Car | null>(null);
    const { onSubmit, loading, error: updateError, success } = useUpdateCar();

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const carData = await useFetchCarDetails(carSlug, token as string);
                setCar(carData.data);
            } catch (error) {
                console.error("Error fetching car details:", error);
            }
        };

        if (isOpen) {
            fetchCarDetails();
        }
    }, [isOpen, carSlug]);

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            car_brand: car?.car_brand || "",
            type: car?.type || "",
            name: car?.name || "",
            transmission: car?.transmission || "MT",
            fuel: car?.fuel || "Petrol",
            color: car?.color || "",
            plate_number: car?.plate_number || "",
            capacity: car?.capacity || 1,
            registration_number: car?.registration_number || 1,
            price: car?.price || 1,
            status: car?.status || "Available",
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        clearErrors,
    } = form;

    // Update form values when car data is fetched
    useEffect(() => {
        if (car) {
            reset({
                car_brand: car.car_brand,
                type: car.type,
                name: car.name,
                transmission: car.transmission,
                fuel: car.fuel,
                color: car.color,
                plate_number: car.plate_number,
                capacity: car.capacity,
                registration_number: car.registration_number,
                price: car.price,
                status: car.status,
            });
        }
    }, [car, reset]);

    // Reset form when dialog is opened/closed
    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, reset, clearErrors]);

    const handleFormSubmit = async (data: FormData) => {
        try {
            if (!carSlug) return;
            const response = await onSubmit(data as UpdateCarForm, carSlug);
            if (response?.status === 200) {
                if (onUpdateCar) {
                    await onUpdateCar(); // Wait for data refresh
                }
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleClose = (e?: React.MouseEvent) => {
        // If event exists, prevent it from bubbling up
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        reset();
        clearErrors();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
        >
            <DialogContent className="bg-white w-full max-w-md rounded-lg shadow-lg my-8">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold">Update Car</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-4">
                    {updateError && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">{updateError}</div>}
                    {success && <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg">Car updated successfully!</div>}
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div>
                            <Label htmlFor="car-name" className="block font-medium mb-1">
                                Car Name
                            </Label>
                            <Input id="car-name" {...register("name")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="car-brand" className="block font-medium mb-1">
                                Car Brand
                            </Label>
                            <Input id="car-brand" {...register("car_brand")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.car_brand && <p className="text-red-500 text-sm mt-1">{errors.car_brand.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="type" className="block font-medium mb-1">
                                Type
                            </Label>
                            <Input id="type" {...register("type")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="transmission" className="block font-medium mb-1">
                                Transmission
                            </Label>
                            <Select {...register("transmission")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select transmission" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MT">Manual Transmission (MT)</SelectItem>
                                    <SelectItem value="AT">Automatic Transmission (AT)</SelectItem>
                                    <SelectItem value="CVT">Continuously Variable Transmission (CVT)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.transmission && <p className="text-red-500 text-sm mt-1">{errors.transmission.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="fuel" className="block font-medium mb-1">
                                Fuel
                            </Label>
                            <Select {...register("fuel")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select fuel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Petrol">Petrol</SelectItem>
                                    <SelectItem value="Diesel">Diesel</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.fuel && <p className="text-red-500 text-sm mt-1">{errors.fuel.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="color" className="block font-medium mb-1">
                                Color
                            </Label>
                            <Input id="color" {...register("color")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="plate-number" className="block font-medium mb-1">
                                Plate Number
                            </Label>
                            <Input id="plate-number" {...register("plate_number")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.plate_number && <p className="text-red-500 text-sm mt-1">{errors.plate_number.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="capacity" className="block font-medium mb-1">
                                Capacity
                            </Label>
                            <Input id="capacity" type="number" {...register("capacity", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="registration-number" className="block font-medium mb-1">
                                Registration Number
                            </Label>
                            <Input id="registration-number" type="number" {...register("registration_number", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.registration_number && <p className="text-red-500 text-sm mt-1">{errors.registration_number.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="price" className="block font-medium mb-1">
                                Price
                            </Label>
                            <Input id="price" type="number" {...register("price", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="status" className="block font-medium mb-1">
                                Status
                            </Label>
                            <Select {...register("status")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Available">Available</SelectItem>
                                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                                    <SelectItem value="Rented">Rented</SelectItem>
                                    <SelectItem value="Booked">Booked</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                        </div>
                    </div>
                    <DialogFooter className="mt-6 pt-4 border-t">
                        <div className="flex w-full gap-4">
                            <Button type="submit" className="flex-1">
                                Update Car
                            </Button>
                            <Button
                                type="button" // Important! This prevents form submission
                                onClick={handleClose}
                                variant="outline"
                                className="flex-1"
                            >
                                Close
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateCarModal;

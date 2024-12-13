import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useCreateMaintenance from "@/hooks/useCreateMaintenance";

interface AddCarMaintenanceModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateCarMaintenance?: () => void;
}
const FormSchema = z.object({
    car_name: z.string().max(100, { message: " Car name cannot exceed 100 characters." }),
    maintenance_date: z.string().max(50, { message: "Maintenance Data cannot exceed 50 characters." }),
    description: z.string().max(300, { message: "Description cannot exceed 300 characters." }),
    cost: z.number().positive({ message: "Price must be a positive number." }),
});

type FormData = z.infer<typeof FormSchema>;

const AddCarMaintenanceModal: React.FC<AddCarMaintenanceModalProps> = ({ isOpen, onOpenChange, onCreateCarMaintenance }) => {
    const { onSubmit, loading, error, success } = useCreateMaintenance();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        clearErrors,
    } = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            car_name: "",
            maintenance_date: "",
            description: "",
            cost: 0,
        },
    });

    // Reset form when dialog is opened/closed
    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, reset, clearErrors]);

    const handleFormSubmit = async (data: FormData) => {
        try {
            const response: any = await onSubmit(data);
            if (response.status === 201) {
                reset();
                if (onCreateCarMaintenance) {
                    onCreateCarMaintenance(); // This will trigger the data refresh
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
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
                    <DialogTitle className="text-xl font-bold">Add New Car Maintenance</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-4">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div>
                            <Label htmlFor="car-name" className="block font-medium mb-1">
                                Car Name
                            </Label>
                            <Input id="car-name" {...register("car_name")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.car_name && <p className="text-red-500 text-sm mt-1">{errors.car_name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="maintenance-date" className="block font-medium mb-1">
                                Maintenance Date
                            </Label>
                            <Input id="maintenance-date" type="date" {...register("maintenance_date")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.maintenance_date && <p className="text-red-500 text-sm mt-1">{errors.maintenance_date.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="description" className="block font-medium mb-1">
                                Description
                            </Label>
                            <Input id="description" {...register("description")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="cost" className="block font-medium mb-1">
                                Cost
                            </Label>
                            <Input id="cost" type="number" {...register("cost", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost.message}</p>}
                        </div>
                    </div>
                    <DialogFooter className="mt-6 pt-4 border-t">
                        <div className="flex w-full gap-4">
                            <Button type="submit" className="flex-1">
                                Add Car Maintenance
                            </Button>
                            <Button
                                type="button" // Important! Thiss prevents form submission
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

export default AddCarMaintenanceModal;

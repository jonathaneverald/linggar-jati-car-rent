import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getToken } from "@/utils/tokenUtils";
import useUpdateDriver, { UpdateDriverForm } from "@/hooks/useUpdateDriver";
import { Driver } from "@/types/driver";
import useFetchDriverDetails from "@/hooks/useFetchDriverDetails";
import { format } from "date-fns";
import useFetchMaintenanceDetails from "@/hooks/useFetchMaintenanceDetails";
import { CarMaintenance } from "@/types/car_maintenance";
import useUpdateMaintenance, { UpdateCarMaintenanceForm } from "@/hooks/useUpdateMaintenance";

interface UpdateCarMaintenanceModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    maintenanceId: number;
    onUpdateCarMaintenance?: () => void;
}

const FormSchema = z.object({
    car_name: z.string().max(100, { message: " Car name cannot exceed 100 characters." }).optional(),
    maintenance_date: z.string().max(50, { message: "Maintenance Data cannot exceed 50 characters." }).optional(),
    description: z.string().max(300, { message: "Description cannot exceed 300 characters." }).optional(),
    cost: z.number().positive({ message: "Cost must be a positive number." }).optional(),
});

type FormData = z.infer<typeof FormSchema>;

const UpdateCarMaintenanceModal: React.FC<UpdateCarMaintenanceModalProps> = ({ isOpen, onOpenChange, maintenanceId, onUpdateCarMaintenance }) => {
    const token = getToken();
    const [carMaintenance, setCarMaintenance] = useState<CarMaintenance | null>(null);
    const { onSubmit, loading, error: updateError, success } = useUpdateMaintenance();

    useEffect(() => {
        const fetchMaintenanceDetails = async () => {
            try {
                const maintenanceData = await useFetchMaintenanceDetails(maintenanceId, token as string);
                setCarMaintenance(maintenanceData.data);
                form.reset({
                    car_name: maintenanceData.data.car_name || "",
                    maintenance_date: format(new Date(maintenanceData.data.maintenance_date), "yyyy-MM-dd"),
                    description: maintenanceData.data.description || "",
                    cost: maintenanceData.data.cost || 0,
                });
            } catch (error) {
                console.error("Error fetching car maintenance details:", error);
            }
        };

        if (isOpen) {
            fetchMaintenanceDetails();
        }
    }, [isOpen, maintenanceId]);

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            car_name: "",
            maintenance_date: "",
            description: "",
            cost: 0,
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        clearErrors,
    } = form;

    // Update form values when driver data is fetched
    useEffect(() => {
        if (carMaintenance) {
            reset({
                car_name: carMaintenance.car_name,
                maintenance_date: format(new Date(carMaintenance.maintenance_date), "yyyy-MM-dd"),
                description: carMaintenance.description,
                cost: carMaintenance.cost,
            });
        }
    }, [carMaintenance, reset]);

    // Reset form when dialog is opened/closed
    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, reset, clearErrors]);

    const handleFormSubmit = async (data: FormData) => {
        try {
            if (!maintenanceId) return;
            const response = await onSubmit(data as UpdateCarMaintenanceForm, maintenanceId);
            if (response?.status === 200) {
                if (onUpdateCarMaintenance) {
                    await onUpdateCarMaintenance(); // Wait for data refresh
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
                    <DialogTitle className="text-xl font-bold">Update Car Maintenance</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-4">
                    {updateError && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">{updateError}</div>}
                    {success && <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg">Car maintenance updated successfully!</div>}
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
                                Update Driver
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

export default UpdateCarMaintenanceModal;

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

interface UpdateDriverModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    driverId: number;
    onUpdateDriver?: () => void;
}

const FormSchema = z.object({
    name: z.string().max(100, { message: "Name cannot exceed 100 characters." }).optional(),
    gender: z.string().max(100, { message: "Gender cannot exceed 100 characters." }).optional(),
    // gender: z.enum(["Male", "Female"], { message: "Gender must be one of 'Male' or 'Female'." }).optional(),
    dob: z.string().max(50, { message: "Date of birth cannot exceed 50 characters." }).optional(),
    address: z.string().max(200, { message: "Adress cannot exceed 200 characters." }).optional(),
    phone_number: z.string().max(20, { message: "Phone number cannot exceed 20 characters." }).optional(),
    license_number: z.string().max(20, { message: "License number cannot exceed 20 characters." }).optional(),
    status: z.string().max(100, { message: "Status cannot exceed 100 characters." }).optional(),
    // status: z.enum(["Available", "Unavailable"], { message: "Status must be one of 'Available' or 'Unavailable'." }).optional(),
});

type FormData = z.infer<typeof FormSchema>;

const UpdateDriverModal: React.FC<UpdateDriverModalProps> = ({ isOpen, onOpenChange, driverId, onUpdateDriver }) => {
    const token = getToken();
    const [driver, setDriver] = useState<Driver | null>(null);
    const { onSubmit, loading, error: updateError, success } = useUpdateDriver();

    useEffect(() => {
        const fetchDriverDetails = async () => {
            try {
                const driverData = await useFetchDriverDetails(driverId, token as string);
                setDriver(driverData.data);
                form.reset({
                    name: driverData.data.name || "",
                    gender: driverData.data.gender || "Male",
                    // dob: driverData.data.dob || "",
                    dob: format(new Date(driverData.data.dob), "yyyy-MM-dd"),
                    address: driverData.data.address || "",
                    phone_number: driverData.data.phone_number || "",
                    license_number: driverData.data.license_number || "",
                    status: driverData.data.status || "Available",
                });
            } catch (error) {
                console.error("Error fetching driver details:", error);
            }
        };

        if (isOpen) {
            fetchDriverDetails();
        }
    }, [isOpen, driverId]);

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            gender: "Male",
            dob: "",
            address: "",
            phone_number: "",
            license_number: "",
            status: "Available",
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
        if (driver) {
            reset({
                name: driver.name,
                gender: driver.gender,
                dob: format(new Date(driver.dob), "yyyy-MM-dd"),
                address: driver.address,
                phone_number: driver.phone_number,
                license_number: driver.license_number,
                status: driver.status,
            });
        }
    }, [driver, reset]);

    // Reset form when dialog is opened/closed
    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, reset, clearErrors]);

    const handleFormSubmit = async (data: FormData) => {
        try {
            if (!driverId) return;
            const response = await onSubmit(data as UpdateDriverForm, driverId);
            if (response?.status === 200) {
                if (onUpdateDriver) {
                    await onUpdateDriver(); // Wait for data refresh
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
                    <DialogTitle className="text-xl font-bold">Update Driver</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-4">
                    {updateError && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">{updateError}</div>}
                    {success && <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg">Driver updated successfully!</div>}
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div>
                            <Label htmlFor="driver-name" className="block font-medium mb-1">
                                Driver Name
                            </Label>
                            <Input id="driver-name" {...register("name")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="gender" className="block font-medium mb-1">
                                Gender
                            </Label>
                            <Select {...register("gender")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="dob" className="block font-medium mb-1">
                                Date of Birth
                            </Label>
                            <Input id="dob" type="date" {...register("dob")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="address" className="block font-medium mb-1">
                                Address
                            </Label>
                            <Input id="address" {...register("address")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="phone-number" className="block font-medium mb-1">
                                Phone Number
                            </Label>
                            <Input id="phone-number" {...register("phone_number")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="license-number" className="block font-medium mb-1">
                                License Number
                            </Label>
                            <Input id="license-number" {...register("license_number")} className="w-full px-3 py-2 border rounded-lg" />
                            {errors.license_number && <p className="text-red-500 text-sm mt-1">{errors.license_number.message}</p>}
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
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
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

export default UpdateDriverModal;
